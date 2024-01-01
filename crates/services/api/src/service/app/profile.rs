use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseTransaction, EntityTrait, IntoActiveModel, QueryFilter,
    QueryOrder,
};
use sea_query::Condition;
use tracing::info;
use uuid::Uuid;

use entity::test::profile::data::{Column as DataColumn, Entity as DataEntity};
use entity::test::profile::profile::{Column, Entity, Model};

use crate::error::{InternalResult, OrcaRepoError};
use crate::server::session::OrcaSession;

pub(crate) struct ProfileService(OrcaSession, Uuid);

impl ProfileService {
    pub fn new(session: OrcaSession, app_id: Uuid) -> Self {
        Self(session, app_id)
    }

    pub fn trx(&self) -> &DatabaseTransaction {
        self.0.trx()
    }

    /// list_profile - list all the Profile that is Bound with Current Application
    pub async fn list_profile(&self) -> InternalResult<Vec<Model>> {
        let _filter = Condition::all().add(Column::AppId.eq(self.1));
        let profiles = Entity::find()
            .filter(_filter)
            .order_by_asc(Column::Name)
            .all(self.trx())
            .await?;
        Ok(profiles)
    }

    /// create_profile - This will New Profile for the specific Application in Orca
    pub async fn create_profile(&self, mut profile: Model) -> InternalResult<Model> {
        profile.id = Uuid::new_v4();
        profile.app_id = self.1;
        let _profile = profile.into_active_model();
        let result = _profile.insert(self.trx()).await?;
        Ok(result)
    }

    /// update_profile - this will update the existing profile information in Orca
    pub async fn update_profile(
        &self,
        profile_id: Uuid,
        mut profile: Model,
    ) -> InternalResult<Model> {
        let _profile = Entity::find_by_id(profile_id).one(self.trx()).await?;
        if _profile.is_none() {
            return Err(OrcaRepoError::ModelNotFound(
                "Profile".to_string(),
                profile_id.to_string(),
            ))?;
        }
        profile.id = profile_id;
        profile.app_id = self.1.clone();
        let _profile = profile.into_active_model();
        let result = _profile.update(self.trx()).await?;
        Ok(result)
    }

    /// delete_profile - this will delete existing profile in Application Application in Orca
    pub async fn delete_profile(&self, profile_id: Uuid) -> InternalResult<()> {
        let result = Entity::delete_by_id(profile_id).exec(self.trx()).await?;
        if result.rows_affected == 0 {
            return Err(OrcaRepoError::ModelNotFound(
                "Profile".to_string(),
                profile_id.to_string(),
            ))?;
        }
        info!("Deleted Application Profile - {:?}", profile_id);
        info!(
            "Deleting Application Profile Data of ProfileID- {:?}",
            profile_id
        );
        let result = DataEntity::delete_many()
            .filter(DataColumn::ProfileId.eq(profile_id))
            .exec(self.trx())
            .await?;
        info!(
            "Deleted Application Profile Data of ProfileID- {:?}, count - {:?}",
            profile_id, result.rows_affected
        );
        Ok(())
    }

    /// delete_profile_data - this will delete existing profile data in Application Application in Orca
    pub async fn delete_profile_data(&self, _data_id: Uuid) -> InternalResult<()> {
        let result = DataEntity::delete_by_id(_data_id).exec(self.trx()).await?;
        if result.rows_affected == 0 {
            return Err(OrcaRepoError::ModelNotFound(
                "Profile Item Data".to_string(),
                _data_id.to_string(),
            ))?;
        }
        info!("Deleted Application Profile Data - {:?}", _data_id);
        Ok(())
    }

    /// batch_update_action - This will update batch Action Group in Application in Orca
    pub async fn batch_update_action(&self, _data_id: Uuid) -> InternalResult<()> {
        let result = DataEntity::delete_by_id(_data_id).exec(self.trx()).await?;
        if result.rows_affected == 0 {
            return Err(OrcaRepoError::ModelNotFound(
                "Profile Item Data".to_string(),
                _data_id.to_string(),
            ))?;
        }
        info!("Deleted Application Profile Data - {:?}", _data_id);
        Ok(())
    }
}
