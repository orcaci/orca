use crate::error::{InternalResult, OrcaRepoError};
use crate::route::Pagination;
use crate::server::session::OrcaSession;
use entity::admin::user;
use entity::admin::user::{ActiveModel, Column as UserColumn, Model};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseTransaction, EntityTrait, NotSet, QueryFilter, QuerySelect, TryIntoModel};
use sea_query::Condition;
use tracing::info;

pub(crate) struct AuthService(OrcaSession);

impl AuthService {
    pub fn new(session: OrcaSession) -> Self {
        Self(session)
    }

    pub fn trx(&self) -> &DatabaseTransaction {
        self.0.trx()
    }

    pub async fn auth_user(&self, email: String, password: String) -> InternalResult<Model> {
        let condition = Condition::all().add(UserColumn::Email.eq(email));
        let user = user::Entity::find().filter(condition).one(self.trx()).await?;
        if user.is_none() {
            return Err(OrcaRepoError::ModelNotFound(
                "User".to_string(),
                "email".to_string(),
            ))?;
        }
        let user = user.unwrap();
        if "password".to_string() != password {
            return Err(OrcaRepoError::InvalidUsername(user.id))?;
        }
        return Ok(user);
    }
}
