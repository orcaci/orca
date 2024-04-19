use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseTransaction, EntityTrait, QueryFilter};
use sea_query::Condition;

use entity::admin::user;
use entity::admin::user::{Column as UserColumn, Model};

use crate::error::{InternalResult, OrcaRepoError};
use crate::server::session::OrcaSession;

pub(crate) struct AuthService(OrcaSession);

impl AuthService {
    pub fn new(session: OrcaSession) -> Self {
        Self(session)
    }

    pub fn trx(&self) -> &DatabaseTransaction {
        self.0.trx()
    }

    pub async fn auth_user(&self, email: String, password: String) -> InternalResult<Model> {
        let condition = Condition::all().add(UserColumn::Email.eq(&email));
        let user = user::Entity::find().filter(condition).one(self.trx()).await?
            .ok_or_else(|| OrcaRepoError::ModelNotFound("User".to_string(), email))?;
        if "password".to_string() != password {
            return Err(OrcaRepoError::InvalidUsername(user.id))?;
        }
        return Ok(user);
    }
}
