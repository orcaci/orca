use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseTransaction, EntityTrait,
              PaginatorTrait, QueryFilter, QueryOrder, TryIntoModel};
use sea_orm::ActiveValue::Set;
use sea_orm::prelude::Uuid;
use tracing::{debug, info};

use cerium::client::Client;
use cerium::client::driver::web::WebDriver;
use entity::prelude::{ActiveExecutionRequest, ActiveItemLog, case_block, CaseEntity, ExecutionKind, ExecutionStatus, ExecutionType};
use entity::prelude::case_block::{BlockKind, BlockType};
use entity::test::ui::case::case;
use entity::test::ui::ExecutionRequest;
use entity::test::ui::log::item_log::{ItemLogStatus, ItemLogType};
use entity::test::ui::log::ItemLog;

use crate::controller::action::ActionController;
use crate::error::{EngineError, EngineResult};

pub struct CaseController<'ccl> {
    db: &'ccl DatabaseTransaction,
    cli: Client,
    drive: WebDriver,
}

impl<'ccl> CaseController<'ccl> {
    pub fn new(
        db: &'ccl DatabaseTransaction,
        drive: WebDriver,
        cli: Client,
    ) -> CaseController<'ccl> {
        Self { db, drive, cli }
    }


    /// execute - will execute the test cases based on the execution request
    pub async fn execute(&self, id: Uuid, er: &ExecutionRequest, log: Option<&ItemLog>,
                         ref_id: Option<Uuid>) -> EngineResult<()> {
        let start = chrono::Utc::now();
        let log_id = log.map(|l| l.id);
        let mut case_log = ActiveItemLog::new(er.id, ref_id, ItemLogType::TestCase,
                                              id, log_id).save(self.db).await?;
        let case = CaseEntity::find_by_id(id).one(self.db).await?
            .ok_or(EngineError::MissingParameter("Case".to_string(), id.into()))?;
        let log = case_log.clone().try_into_model()?;
        let result = self.process(&case, er, Some(&log)).await;

        case_log.finished_at = Set(chrono::Utc::now().into());
        case_log.execution_time = Set((chrono::Utc::now() - start).num_milliseconds() as i32);
        match result {
            Ok(_) => {
                case_log.status = Set(ItemLogStatus::Success);
                case_log.save(self.db).await?;
            }
            Err(e) => {
                case_log.status = Set(ItemLogStatus::Failed);
                case_log.save(self.db).await?;
                return Err(e);
            }
        }
        return Ok(());
    }


    pub async fn run(&self, id: Uuid, is_dry_run: bool) -> EngineResult<()> {
        let mut am_er = ActiveExecutionRequest::new(id, ExecutionType::TestCase,
                                                    ExecutionKind::Trigger,
                                                    ExecutionStatus::Started, 0,
                                                    is_dry_run, Some(format!("[TC] Executing - {id}")), ).save(self.db).await?;
        let model_er = am_er.clone().try_into_model()?;
        info!("[{er}] Trigger Test Case {case_id}", er=model_er.id, case_id = id);
        self.execute(id, &model_er, None, Some(id)).await?;
        am_er.finished_at = Set(chrono::Utc::now().into());
        am_er.status = Set(ExecutionStatus::Completed);
        am_er.save(self.db).await?;
        Ok(())
    }

    /// process will get the block and execute in the batch based on the kind of the block
    pub async fn process(&self, case: &case::Model, er: &ExecutionRequest, log: Option<&ItemLog>) -> EngineResult<()> {
        let mut block_page = case_block::Entity::find()
            .filter(case_block::Column::CaseId.eq(case.id))
            .order_by_asc(case_block::Column::ExecutionOrder)
            .paginate(self.db, 10);
        while let Some(blocks) = block_page.fetch_and_next().await? {
            for block in blocks.into_iter() {
                let start = chrono::Utc::now();
                let log_id = log.map(|l| l.id);
                let mut item_log = ActiveItemLog::new(er.id, block.reference.clone(), ItemLogType::TestCaseBlock,
                                                      block.id.clone(), log_id).save(self.db).await?;
                let _log = item_log.clone().try_into_model()?;
                let result = self.switch_block(&block, er, log).await;
                item_log.execution_time = Set((chrono::Utc::now() - start).num_milliseconds() as i32);
                item_log.finished_at = Set(chrono::Utc::now().into());
                match result {
                    Ok(_) => {
                        item_log.status = Set(ItemLogStatus::Success);
                        item_log.save(self.db).await?;
                    }
                    Err(e) => {
                        item_log.status = Set(ItemLogStatus::Failed);
                        item_log.save(self.db).await?;
                        return Err(e);
                    }
                }
            }
        }
        Ok(())
    }

    /// switch_block - function to switch the block based on the type and kind of the block
    async fn switch_block(&self, block: &case_block::Model, er: &ExecutionRequest,
                          log: Option<&ItemLog>) -> EngineResult<()> {
        debug!("Processing Block - {:#?}", block);
        let result = match block.kind {
            // BlockKind::Loop => match block.type_field {
            //     BlockType::InMemory => self.process_action_group(block),
            //     BlockType::DataTable => self.process_action_group(block),
            //     _ => todo!("Need to raise a error from here since non other supported"),
            // },
            // BlockKind::SelfReference => match block.type_field {
            //     BlockType::Condition => self.process_in_memory_loop(block, er, log),
            //     BlockType::YesCase => self.process_in_memory_loop(block, er, log),
            //     BlockType::NoCase => self.process_in_memory_loop(block, er, log),
            //     BlockType::Loop => self.process_in_memory_loop(block, er, log),
            //     _ => todo!("Need to raise a error from here since non other supported"),
            // },
            BlockKind::Reference => match block.type_field {
                BlockType::ActionGroup => self.process_action_group(block, er, log),
                BlockType::Assertion => self.process_action_group(block, er, log),
                _ => todo!("Need to raise a error from here since non other supported"),
            },
            _ => return Ok(())
        }
            .await?;
        Ok(())
    }

    async fn process_in_memory_loop(&self, block: &case_block::Model, er: &ExecutionRequest, log: Option<&ItemLog>) -> EngineResult<()> {
        Ok(())
    }

    async fn process_datatable_loop(&self, block: &case_block::Model, er: &ExecutionRequest, log: Option<&ItemLog>) -> EngineResult<()> {
        Ok(())
    }

    async fn process_condition(&self, block: &case_block::Model, er: &ExecutionRequest, log: Option<&ItemLog>) -> EngineResult<()> {
        Ok(())
    }

    async fn process_action_group(&self, block: &case_block::Model, er: &ExecutionRequest,
                                  log: Option<&ItemLog>) -> EngineResult<()> {
        info!("Starting processing {block_id} ", block_id = block.id);
        let controller = ActionController::new(self.db, self.drive.clone(), self.cli.clone());
        let result = controller
            .execute(block.reference.unwrap(), er, log, Some(block.id))
            .await?;
        Ok(result)
    }
}
