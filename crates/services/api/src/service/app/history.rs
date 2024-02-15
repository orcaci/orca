use sea_orm::{ActiveModelTrait, DatabaseTransaction, EntityTrait, QueryOrder};
use sea_orm::ActiveValue::Set;
use uuid::Uuid;
use entity::test::history;
use entity::test::history::{Entity, Column, Model, ExecutionKind, ExecutionType, ExecutionStatus};
use crate::error::InternalResult;
use crate::server::session::OrcaSession;

pub(crate) struct HistoryService(OrcaSession);

impl HistoryService {
    pub fn new(session: OrcaSession) -> Self {
        Self(session)
    }

    pub fn trx(&self) -> &DatabaseTransaction {
        self.0.trx()
    }

    /// list all the History Data in the Orca Application
    pub async fn list_history(&self) -> InternalResult<Vec<Model>> {
        let histories = Entity::find()
            .order_by_desc(Column::Id)
            .all(self.trx())
            .await?;
        Ok(histories)
    }

    pub async fn create_history(&self, id: Uuid, kind: ExecutionKind, history_type: ExecutionType,
                                desc: Option<String>, is_dry_run: Option<bool>) -> InternalResult<Model> {
        let history = history::ActiveModel {
            kind: Set(kind),
            is_dry_run: Set(is_dry_run.unwrap_or(false)),
            reference: Set(id),
            history_type: Set(history_type),
            description: Set(desc),
            status: Set(ExecutionStatus::Running),
            triggered_on: Set(chrono::Utc::now().naive_utc()),
            triggered_by: Set(Some(1)),
            ..Default::default()
        };
        Ok(history.insert(self.trx()).await?)
    }


}