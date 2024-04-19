use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseTransaction, EntityTrait, QueryFilter};
use sea_orm::ActiveValue::Set;
use sea_query::Condition;
use uuid::Uuid;

use entity::prelude::{ExecutionRequest, ExecutionRequestEntity, ItemLog, ItemLogColumn, ItemLogEntity, ItemLogType};
use entity::test::history;
use entity::test::history::{ExecutionKind, ExecutionStatus, ExecutionType, Model};

use crate::error::{InternalResult, OrcaRepoError};
use crate::server::session::OrcaSession;

pub(crate) struct HistoryService(OrcaSession);

impl HistoryService {
    pub fn new(session: OrcaSession) -> Self {
        Self(session)
    }

    pub fn trx(&self) -> &DatabaseTransaction {
        self.0.trx()
    }

    /// return Log By Request ID in the Orca Application
    pub async fn log_by_id(&self, history_id: i32, log_type: ItemLogType, log_id: Uuid)
                           -> InternalResult<Vec<ItemLog>> {
        let _filter = Condition::all()
            .add(ItemLogColumn::ErId.eq(history_id))
            .add(ItemLogColumn::RefType.eq(log_type))
            .add(ItemLogColumn::StepId.eq(log_id));
        let log = ItemLogEntity::find().filter(_filter).one(self.trx()).await?
            .ok_or_else(|| OrcaRepoError::ModelNotFound("Log".to_string(), log_id.to_string()))?;
        let _filter_2 = Condition::all()
            .add(ItemLogColumn::ErId.eq(history_id))
            .add(ItemLogColumn::LogId.eq(log.id))
            .add(
                Condition::any().add(ItemLogColumn::RefType.eq(ItemLogType::TestCase))
                    .add(ItemLogColumn::RefType.eq(ItemLogType::ActionGroup))
                    .add(ItemLogColumn::RefType.eq(ItemLogType::Action))
            );
        let logs = ItemLogEntity::find().filter(_filter_2).all(self.trx()).await?;
        Ok(logs)
    }

    /// return History By ID in the Orca Application
    pub async fn by_id(&self, id: i32) -> InternalResult<ExecutionRequest> {
        let histories = ExecutionRequestEntity::find_by_id(id).one(self.trx()).await?
            .ok_or_else(|| OrcaRepoError::ModelNotFound("Request History".to_string(), id.to_string()))?;
        Ok(histories)
    }

    /// list all the History Data in the Orca Application
    pub async fn list_history(&self) -> InternalResult<Vec<ExecutionRequest>> {
        let histories = ExecutionRequestEntity::find().all(self.trx()).await?;
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