use chrono::Utc;
use sea_orm::ActiveValue::Set;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, ConnectionTrait, DatabaseBackend, DatabaseTransaction,
    EntityTrait, IntoActiveModel, JsonValue, ModelTrait, NotSet, QueryFilter, QueryOrder,
    Statement, TryIntoModel,
};
use sea_orm_migration::SchemaManager;
use sea_query::{
    Alias, Asterisk, ColumnDef, Condition, Expr, Order, PostgresQueryBuilder, Query, Table,
};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tracing::info;
use uuid::Uuid;

use entity::test::datatable::{Column, Entity, Model};
use entity::test::field::{Column as FieldColumn, Entity as FieldEntity, Model as FieldModel};

use crate::error::{InternalResult, OrcaRepoError};
use crate::server::session::OrcaSession;
use crate::utils::replace_special_chars;

#[derive(Clone, Deserialize, Serialize)]
pub(crate) struct TableDataRequest {
    pub row_id: i32,
    pub field_id: String,
    pub data: String,
}

pub(crate) struct DatatableService(OrcaSession, Uuid);

impl DatatableService {
    pub fn new(session: OrcaSession, app_id: Uuid) -> Self {
        Self(session, app_id)
    }

    pub fn trx(&self) -> &DatabaseTransaction {
        self.0.trx()
    }

    /// list_datatables - list all the DataTable in Specific Application in the Orca
    pub async fn list_datatables(&self) -> InternalResult<Vec<Model>> {
        let tables = Entity::find()
            .filter(Column::AppId.eq(self.1))
            .order_by_asc(Column::Name)
            .all(self.trx())
            .await?;
        Ok(tables)
    }

    /// get_datatable - Get the datatable by id in application
    pub async fn get_datatable(&self, id: i32) -> InternalResult<Model> {
        let tables = Entity::find_by_id(id).one(self.trx()).await?;
        if tables.is_none() {
            return Err(OrcaRepoError::ModelNotFound(
                "Datatable".to_string(),
                id.to_string(),
            ))?;
        }
        Ok(tables.unwrap())
    }

    /// get_datatable - Get the datatable by id in application
    pub async fn get_datatable_info(&self, id: i32) -> InternalResult<Model> {
        let mut table = self.get_datatable(id).await?;
        let fields = table.find_related(FieldEntity).all(self.trx()).await?;
        table.fields = Some(fields);
        Ok(table)
    }

    /// create_datatable - this will create new DataTable in Application in Orca
    pub async fn create_datatable(&self, mut table: Model) -> InternalResult<Model> {
        table.app_id = self.1;
        table.table_name = format!("table_{:?}", Utc::now().timestamp_micros());
        let mut _table = table.into_active_model();
        _table.id = NotSet;
        let result = _table.insert(self.trx()).await?;
        let stm = format!(
            r#"CREATE TABLE IF NOT EXISTS {} (id SERIAL NOT NULL PRIMARY KEY )"#,
            result.table_name
        );
        let exec_res = self
            .trx()
            .execute(Statement::from_string(DatabaseBackend::Postgres, stm))
            .await?;
        info!("Created the Table - {:?}", exec_res);
        Ok(result)
    }

    /// create_new_field - this will create new Field in Data Application in Orca
    pub async fn create_new_field(
        &self,
        table_id: i32,
        mut field: FieldModel,
    ) -> InternalResult<FieldModel> {
        let table = self.get_datatable(table_id).await?;
        field.table_id = table_id;
        let mut field = field.into_active_model();
        let _field_id = replace_special_chars(field.name.clone().unwrap().as_str(), '_');
        let mut field_id = _field_id.clone();
        let mut iter = 0;
        loop {
            field.field_id = Set(field_id.clone());
            let result = field.clone().insert(self.trx()).await;
            if !result.is_err() {
                break;
            }
            iter += 1;
            field_id = format!("{_field_id}_{iter}");
        }
        let manager = SchemaManager::new(self.trx());
        let res = manager
            .alter_table(
                Table::alter()
                    .table(Alias::new(table.table_name))
                    .add_column(ColumnDef::new(Alias::new(field_id.clone())).string())
                    .to_owned(),
            )
            .await?;

        Ok(field.try_into_model()?)
    }

    /// drop_field - this will drop Field in Data Application in Orca
    pub async fn drop_field(&self, table_id: i32, field_id: String) -> InternalResult<()> {
        let _filter = Condition::all()
            .add(FieldColumn::FieldId.eq(field_id.clone()))
            .add(FieldColumn::TableId.eq(table_id));

        let manager = SchemaManager::new(self.trx());
        manager
            .alter_table(
                Table::alter()
                    .table(FieldEntity)
                    .drop_column(Alias::new(field_id.clone()))
                    .to_owned(),
            )
            .await?;
        let result = FieldEntity::delete_many()
            .filter(_filter)
            .exec(self.trx())
            .await?;
        info!("Deleted Column({:?}) from Table ({:?})", field_id, table_id);
        info!("field Removed {:?}", result.rows_affected);
        Ok(())
    }

    /// batch_update_data - this will Batch update data in Application Datatable
    pub async fn batch_update_data(
        &self,
        table_id: i32,
        table_datas: Vec<TableDataRequest>,
    ) -> InternalResult<()> {
        let table = self.get_datatable(table_id).await?;
        // let result = table_datas.iter_mut().map(|item| {
        //     return 1;
        // }).collect::<Vec<u8>>()?;
        for data in table_datas {
            let query = Query::update()
                .table(Alias::new(table.table_name.clone()))
                .values([(Alias::new(data.field_id), data.data.into())])
                .and_where(Expr::col(Alias::new("id")).eq(data.row_id))
                .to_owned()
                .to_string(PostgresQueryBuilder);
            self.trx()
                .execute(Statement::from_string(DatabaseBackend::Postgres, query))
                .await?;
        }
        Ok(())
    }

    /// get_data - get data for specify Datatable in Application
    pub async fn get_data(&self, table_id: i32) -> InternalResult<Vec<Value>> {
        let table = self.get_datatable(table_id).await?;
        let query = Query::select()
            .from(Alias::new(table.table_name.clone()))
            .expr(Expr::col(Asterisk))
            .order_by(Alias::new("id"), Order::Asc)
            .to_owned()
            .to_string(PostgresQueryBuilder);
        let data = Entity::find()
            .from_raw_sql(Statement::from_string(DatabaseBackend::Postgres, query))
            .into_model::<JsonValue>()
            .all(self.trx())
            .await?;
        Ok(data)
    }
    /// update_data - get data for specify Datatable in Application
    pub async fn update_data(&self, table_id: i32, value: Value) -> InternalResult<()> {
        let table = self.get_datatable(table_id).await?;
        let query = Query::insert()
            .into_table(Alias::new(table.table_name.clone()))
            .or_default_values()
            .to_owned()
            .to_string(PostgresQueryBuilder);
        self.trx()
            .execute(Statement::from_string(DatabaseBackend::Postgres, query))
            .await?;
        Ok(())
    }

    /// delete_action - this will delete Action for Action Group in Application in Orca
    pub async fn delete_table(&self, table_id: i32) -> InternalResult<()> {
        let table = Entity::find_by_id(table_id).one(self.trx()).await?;
        if table.is_none() {
            return Err(OrcaRepoError::ModelNotFound(
                "Table".to_string(),
                table_id.to_string(),
            ))?;
        }
        let table = table.unwrap();
        let manager = SchemaManager::new(self.trx());
        let _res = manager
            .drop_table(
                Table::drop()
                    .table(Alias::new(table.table_name.clone()))
                    .to_owned(),
            )
            .await?;
        table.delete(self.trx()).await?;
        Ok(())
    }
}
