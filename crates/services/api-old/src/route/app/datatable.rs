use std::fmt::format;
use std::time::SystemTime;
use actix_web::{HttpResponse, web};
use actix_web::web::Path;
use chrono::Utc;
use log::{debug, info, log};
use sea_orm::{ActiveModelTrait, ColumnTrait, ConnectionTrait, DatabaseBackend, DbBackend, EntityTrait, ExecResult, IntoActiveModel, JsonValue, ModelTrait, NotSet, QueryFilter, QueryOrder, QueryResult, Statement, TryGetableMany};
use sea_orm::ActiveValue::Set;
use sea_orm::prelude::Uuid;

use cerium::error::web::OrcaError;
use entity::test::ui::action::{action, datatable, field};
use migration::Table;

use crate::utils::config::CONFIG;
use crate::utils::replace_special_chars;

/// datatable_config - this will register all the endpoint in Datatable route
pub fn datatable_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/datatable")
            .route("/", web::get().to(get_datatables))
            .route("/", web::post().to(create_datatable))
            .route("/{table_id}/", web::put().to(update_action))
            .route("/{table_id}/", web::delete().to(delete_action))
            .route("/{table_id}/field", web::post().to(create_new_field))
            .route("/{table_id}/data", web::get().to(get_dt_data))
            .route("/{table_id}/meta", web::get().to(get_datatable_meta))
    );

}



async fn get_dt_meta(app_id: Uuid, dt_id: i32) -> Option<datatable::Model> {
    let db = &CONFIG.get().await.db_client;
    let table = datatable::Entity::find()
        .filter(datatable::Column::AppId.eq(app_id)).filter(datatable::Column::Id.eq(dt_id))
        .one(db).await.expect("TODO: panic message");
    if table.is_none() {
        return None;
    }
    let mut _table: datatable::Model = table.unwrap();
    let fields = _table.find_related(field::Entity)
        .all(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    _table.fields = Some(fields);
    Some(_table)
}

async fn create_new_field(path: Path<(Uuid, i32)>, mut body: web::Json<field::Model>) -> Result<HttpResponse, OrcaError> {
    let (app_id, table_id) = path.into_inner();
    let db = &CONFIG.get().await.db_client;
    body.table_id = table_id;
    let mut field = body.clone().into_active_model();
    field.field_id = Set(replace_special_chars(field.name.clone().unwrap().as_str(), '_'));
    let result = field.insert(db).await.expect("TODO: panic message");
    let tables = field::Entity::find().filter(datatable::Column::AppId.eq(app_id))
        .order_by_asc(datatable::Column::Name).all(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(tables))
}

async fn get_dt_data(path: Path<(Uuid, i32)>) -> Result<HttpResponse, OrcaError> {
    let (app_id, table_id) = path.into_inner();
    let db = &CONFIG.get().await.db_client;
    let _table_meta = get_dt_meta(app_id, table_id).await;
    if _table_meta.is_none() {
        return Ok(HttpResponse::NotFound().finish());
    }
    let _table = _table_meta.unwrap();
    // let query_res_vec: Vec<QueryResult> = db
    // .query_all(Statement::from_string(db.get_database_backend(),
    //     format!("SELECT * FROM `{}`;", _table.table_name.clone()).parse().unwrap(),
    // ))
    // .await.expect("TODO: panic message");
    // let unique: Vec<JsonValue> = JsonValue::find_by_statement(Statement::from_string(
    //     DbBackend::Postgres,
    //     format!("SELECT * FROM `{}`;", _table.table_name.clone())
    // ))
    // .all(db)
    // .await.expect("TODO: panic message");
    Ok(HttpResponse::Ok().finish())
        // .json(unique))
}


/// get_datatable - list all the DataTable in Specific Application in the Orca
async fn get_datatables(path: Path<(Uuid)>) -> Result<HttpResponse, OrcaError> {
    let app_id = path.into_inner();
    let tables = datatable::Entity::find().filter(datatable::Column::AppId.eq(app_id))
        .order_by_asc(datatable::Column::Name).all(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(tables))
}


/// create_datatable - this will create new DataTable in Application in Orca
async fn create_datatable(path: Path<(Uuid)>, mut body: web::Json<datatable::Model>) -> Result<HttpResponse, OrcaError> {
    let app_id = path.into_inner();
    let db = &CONFIG.get().await.db_client;
    body.app_id = app_id;
    let mut table = body.clone().into_active_model();
    table.id = NotSet;
    table.table_name = Set(format!("table_{:?}", Utc::now().timestamp_micros()));
    let result = table.insert(db).await.expect("TODO: panic message");
    // TODO: this code need to revamp since this is only work on postgres
    let stm = format!(r#"CREATE TABLE IF NOT EXISTS {} (id SERIAL NOT NULL PRIMARY KEY )"#, result.table_name);
    let exec_res: ExecResult = db.execute(
        Statement::from_string(DatabaseBackend::Postgres, stm)
    ).await.expect("TODO: panic message");
    info!("{:?}", exec_res.rows_affected());
    Ok(HttpResponse::Created().json(result))
}

/// update_action - this will create new Application in Orca
async fn update_action(path: Path<(Uuid, Uuid, Uuid)>, body: web::Json<action::Model>) -> Result<HttpResponse, OrcaError> {
    let (_, _, action_id) = path.into_inner();
    let action = action::Entity::find_by_id(action_id).one(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    if let Some(_action) = action {
        let mut _action: action::ActiveModel = _action.into();
        _action.kind = Set(body.kind.to_owned());
        _action.description = Set(body.description.to_owned());
        _action.target_kind = Set(body.target_kind.to_owned());
        _action.target_value = Set(body.target_value.to_owned());
        _action.data_kind = Set(body.data_kind.to_owned());
        _action.data_value = Set(body.data_value.to_owned());
        _action.execution_order = Set(body.execution_order.to_owned());
        let _ = _action.save(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
        return Ok(HttpResponse::NoContent().finish());
    }
    Ok(HttpResponse::NoContent().finish())
}




/// delete_action - this will delete Action for Action Group in Application in Orca
async fn delete_action(path: Path<(Uuid, Uuid, Uuid)>) -> Result<HttpResponse, OrcaError> {
    let (_, _, action_id) = path.into_inner();
    let action_instance = action::Entity::find_by_id(action_id).one(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    if let Some(_action) = action_instance {
        let action_obj: action::ActiveModel = _action.into();
        let action_order = action_obj.clone().execution_order.unwrap();
        action_obj.delete(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
        let actions = action::Entity::find().filter(action::Column::ExecutionOrder.gt(action_order)).all(&CONFIG.get().await.db_client).await
            .expect("TODO: panic message");
        let actions: Vec<action::ActiveModel> = actions.into_iter().map(|mut x| {
            x.execution_order = x.execution_order + 1;
            x.into_active_model()
        }).collect();
        action::Entity::insert_many(actions).exec(&CONFIG.get().await.db_client).await
                .expect("TODO: panic message");
        return Ok(HttpResponse::NoContent().finish());
    }
    Ok(HttpResponse::NoContent().finish())
}


/// get_datatable_meta - Get the DataTable Metadata
async fn get_datatable_meta(path: Path<(Uuid, i32)>) -> Result<HttpResponse, OrcaError> {
    let (app_id, table_id) = path.into_inner();
    let dtable = get_dt_meta(app_id, table_id).await;
    if dtable.is_none(){
        return Ok(HttpResponse::NotFound().finish());
    }
    Ok(HttpResponse::Ok().json(dtable.unwrap()))
}


