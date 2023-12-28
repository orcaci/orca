use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseTransaction, EntityTrait, IntoActiveModel, QueryFilter, QueryOrder, TryIntoModel};
use sea_query::Condition;
use tracing::info;
use uuid::Uuid;

use entity::prelude::group::{ActionGroupKind, Column, Entity, Model};

use crate::error::{InternalResult, OrcaRepoError};
use crate::server::session::OrcaSession;

pub(crate) struct GroupService(OrcaSession);

impl GroupService {
    pub fn new(session: OrcaSession) -> Self {
        Self(session)
    }

    pub fn trx(&self) -> &DatabaseTransaction {
        self.0.trx()
    }


    /// get_groups - list all the Action Group in Specific Application in the Orca Application
    pub async fn get_groups(&self, app_id: Uuid) -> InternalResult<Vec<Model>> {
        let _filter = Condition::all()
                .add(Column::AppId.eq(app_id))
                .add(Column::TypeField.eq(ActionGroupKind::ActionGroup));
        let groups = Entity::find().filter(_filter)
            .order_by_asc(Column::Name).all(self.trx()).await?;
        Ok(groups)
    }

    /// create_group - This will create new Action Group in Application in Orca
    pub async fn create_group(&self, app_id: Uuid,  mut group: Model) -> InternalResult<Model> {
        group.id = Uuid::new_v4();
        group.app_id = app_id;
        let app = group.into_active_model();
        let result = app.insert(self.trx()).await?;
        Ok(result)
    }

    /// update_action_group - this will create new Application in Orca
    pub async fn update_action_group(&self, group_id: Uuid, mut group: Model) -> InternalResult<Model> {
        let _group = Entity::find_by_id(group_id)
            .one(self.trx()).await?;
        if _group.is_none() {
            return Err(OrcaRepoError::ModelNotFound("Action Group".to_string(), group_id.to_string()))?;
        }
        let group = group.into_active_model();
        let result = group.save(self.trx()).await?;
        Ok(result.try_into_model()?)
    }

    /// delete_action_group - this will delete Action Group in Application Application in Orca
    pub async fn delete_group(&self, group_id: Uuid) -> InternalResult<()> {
        let result = Entity::delete_by_id(group_id).exec(self.trx()).await?;
        if result.rows_affected == 0 {
            return Err(OrcaRepoError::ModelNotFound("Action Group".to_string(), group_id.to_string()))?;
        }
        info!("Deleting Action group - {:?}", group_id);
        Ok(())
    }

}



