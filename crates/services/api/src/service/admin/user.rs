use sea_orm::{
    ActiveModelTrait, DatabaseTransaction, EntityTrait, NotSet, QuerySelect, TryIntoModel,
};
use tracing::info;

use entity::admin::user;
use entity::admin::user::{ActiveModel, Model};

use crate::error::{InternalResult, OrcaRepoError};
use crate::route::Pagination;
use crate::server::session::OrcaSession;

pub(crate) struct UserService(OrcaSession);

impl UserService {
    pub fn new(session: OrcaSession) -> Self {
        Self(session)
    }

    pub fn trx(&self) -> &DatabaseTransaction {
        self.0.trx()
    }

    pub async fn create_user(&self, mut user: ActiveModel) -> InternalResult<Model> {
        user.id = NotSet;
        let result = user.insert(self.trx()).await?;
        Ok(result)
    }

    pub async fn list_users(&self, page: Pagination) -> InternalResult<Vec<Model>> {
        let users = user::Entity::find()
            .offset((page.offset() - 1) * page.limit())
            .limit(page.limit())
            .all(self.trx())
            .await?;
        Ok(users)
    }

    pub async fn get_user_by_id(&self, id: String) -> InternalResult<()> {
        let user = user::Entity::find_by_id(&id).one(self.trx()).await?.ok_or_else(|| {
            OrcaRepoError::ModelNotFound("User".to_string(), id.clone())
        })?;
        return Ok(());
    }

    pub async fn update_user(&self, mut user: ActiveModel) -> InternalResult<Model> {
        let result = user.save(self.trx()).await?.try_into_model()?;
        return Ok(result);
    }

    pub async fn delete_user_by_id(&self, id: String) -> InternalResult<()> {
        let result = user::Entity::delete_by_id(id.clone()).exec(self.trx()).await?;
        if result.rows_affected == 0 {
            return Err(OrcaRepoError::ModelNotFound(
                "User".to_string(),
                id.clone(),
            ))?;
        }
        info!(
            "User Got deleted - {:?}, status - {:?}",
            id, result.rows_affected
        );
        return Ok(());
    }
}
