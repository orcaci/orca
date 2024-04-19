use sea_orm::ActiveModelTrait;
use sea_orm::DatabaseTransaction;
use sea_orm::prelude::async_trait::async_trait;

use crate::error::EntityResult;

#[derive(Clone)]
pub struct Session(DatabaseTransaction, String);

impl Session {
    pub fn new(trx: DatabaseTransaction, user_id: String) -> Self {
        Self(trx, user_id)
    }
    pub fn trx(&self) -> &DatabaseTransaction {
        &self.0
    }

    /// user_id - returns the user_id
    pub fn user_id(&self) -> &str {
        &self.1
    }
}

#[async_trait]
pub trait SessionLayer: ActiveModelTrait {
    fn update_audit(&mut self, user_id: String) -> EntityResult<()>;

    fn create_audit(&mut self, user_id: String) -> EntityResult<()>;

    fn delete_audit(&mut self, user_id: String) -> EntityResult<()> {
        Ok(())
    }

    // async fn ssave<'a, 'b>(&'a mut self, session: &'b Session) -> Result<Self, DbErr>
    //     where
    //         <Self::Entity as EntityTrait>::Model: IntoActiveModel<Self>,
    //         Self: ActiveModelBehavior + 'a,
    // {
    //     debug!("Saving the session layer");
    //     let c = self.update_audit(session.user_id().to_string())?;
    //     Ok(self.save(session.trx()).await?)
    // }

    // fn force_save(&self) -> EntityResult<()> {
    //     debug!("!! Force Saving the session layer");
    //     let model = self.try_into_model()
    //         .unwrap_or_else();
    //     // model.save().map_err(|e| EntityError::FailedActiveModelConvert(e))?;
    //     Ok(())
    // }
}
