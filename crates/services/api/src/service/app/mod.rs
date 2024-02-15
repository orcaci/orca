use sea_orm::{ActiveModelTrait, DatabaseTransaction, EntityTrait, IntoActiveModel, QueryOrder};
use uuid::Uuid;

use entity::app::app::{Column, Entity, Model};

use crate::error::InternalResult;
use crate::server::session::OrcaSession;

pub(crate) mod action;
pub(crate) mod case;
pub(crate) mod datatable;
pub(crate) mod group;
pub(crate) mod profile;
pub(crate) mod suit;
pub(crate) mod history;

pub(crate) struct AppService(OrcaSession);

impl AppService {
    pub fn new(session: OrcaSession) -> Self {
        Self(session)
    }

    pub fn trx(&self) -> &DatabaseTransaction {
        self.0.trx()
    }

    /// list all the Application in the Orca Application
    pub async fn list_apps(&self) -> InternalResult<Vec<Model>> {
        let actions = Entity::find()
            .order_by_asc(Column::Name)
            .all(self.trx())
            .await?;
        Ok(actions)
    }

    /// create_app - this will create new Application in Orca
    pub async fn create_app(&self, mut app: Model) -> InternalResult<Model> {
        app.id = Uuid::new_v4();
        let app = app.into_active_model();
        let result = app.insert(self.trx()).await?;
        Ok(result)
    }

    /// create_app - this will create new Application in Orca
    pub async fn update_app(&self, mut app: Model) -> InternalResult<Model> {
        app.id = Uuid::new_v4();
        let app = app.into_active_model();
        let result = app.insert(self.trx()).await?;
        Ok(result)
    }
}
