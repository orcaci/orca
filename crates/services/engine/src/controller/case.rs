use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseTransaction, EntityTrait, IntoActiveModel, PaginatorTrait, QueryFilter, QueryOrder, TryIntoModel};
use sea_orm::ActiveValue::Set;
use sea_orm::prelude::Uuid;
use tracing::{error, info};

use cerium::client::Client;
use cerium::client::driver::web::WebDriver;
use entity::prelude::case::Entity;
use entity::prelude::case_block;
use entity::prelude::case_block::{BlockKind, BlockType};
use entity::test::ui::{ExecutionRequest, request};
use entity::test::ui::case::case;
use entity::test::ui::log::{item_log, ItemLog};
use entity::test::ui::log::item_log::{ItemLogStatus, ItemLogType, new};

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


    /// run - will execute the test cases based on the execution request
    pub async fn run(&self, id: Uuid, er: &ExecutionRequest, log: Option<&ItemLog>) -> EngineResult<()> {
        info!("[{er}] Trigger Test Case {action_id}", er=er.ref_id, action_id = id);
        let start = chrono::Utc::now();
        let log_id = match log {
            Some(l) => Some(l.id),
            None => None,
        };
        let mut log_am = new(er.ref_id, ItemLogType::ActionGroup, id, log_id).save(self.db).await?;
        // let mut log_item = item_log::Model {
        //     ref_id: er.ref_id,
        //     ref_type: ItemLogType::TestCase,
        //     step_id: id,
        //     has_screenshot: false,
        //     has_recording: false,
        //     execution_time: 0,
        //     status: ItemLogStatus::Running,
        //     log_id: None,
        //     created_at: start.into(),
        //     created_by: "system".to_string(),
        //     finished_at: chrono::Utc::now().into(),
        //     ..Default::default()
        // };
        // if log.is_some() {
        //     log_item.log_id = Some(log.unwrap().id);
        // }
        // let mut log_item_am = log_item.into_active_model().save(self.db).await?;
        let case = Entity::find_by_id(id).one(self.db).await?
            .ok_or(EngineError::MissingParameter("ActionGroup".to_string(), id.into()))?;
        let log = log_am.clone().try_into_model()?;
        self.process(&case, er, Some(&log)).await?;

        log_am.execution_time = Set((chrono::Utc::now() - start).num_milliseconds() as i32);
        log_am.status = Set(ItemLogStatus::Success);
        log_am.finished_at = Set(chrono::Utc::now().into());
        log_am.save(self.db).await?;
        Ok(())
    }


    /// run_case - will execute the test case by the case ID
    // pub async fn run_case(&self, id: Uuid) -> EngineResult<()> {
    //     let case_res = Entity::find_by_id(id).one(self.db).await?;
    //     if case_res.is_none() {
    //         error!("Unable to find the Case - {:?}", id.clone());
    //         return Ok(());
    //     }
    //     let case: &case::Model = &case_res.unwrap();
    //     info!(
    //         "Start Processing Case - [[ {name} || {id} ]]",
    //         name = case.name,
    //         id = case.id
    //     );
    //     self.process(case).await?;
    //     Ok(())
    // }

    /// process will get the block and execute in the batch based on the kind of the block
    pub async fn process(&self, case: &case::Model, er: &ExecutionRequest, log: Option<&ItemLog>) -> EngineResult<()> {
        let mut block_page = case_block::Entity::find()
            .filter(case_block::Column::CaseId.eq(case.id))
            .order_by_asc(case_block::Column::ExecutionOrder)
            .paginate(self.db, 10);
        while let Some(blocks) = block_page.fetch_and_next().await? {
            for block in blocks.into_iter() {
                self.switch_block(&block, er, log).await?;
            }
        }
        Ok(())
    }

    /// switch_block - function to switch the block based on the type and kind of the block
    async fn switch_block(&self, block: &case_block::Model, er: &ExecutionRequest,
                          log: Option<&ItemLog>) -> EngineResult<()> {
        let result = match block.kind {
            // BlockKind::Loop => match block.type_field {
            //     BlockType::InMemory => self.process_action_group(block),
            //     BlockType::DataTable => self.process_action_group(block),
            //     _ => todo!("Need to raise a error from here since non other supported"),
            // },
            BlockKind::SelfReference => match block.type_field {
                BlockType::Condition => self.process_action_group(block, er, log),
                BlockType::YesCase => self.process_action_group(block, er, log),
                BlockType::NoCase => self.process_action_group(block, er, log),
                BlockType::Loop => self.process_action_group(block, er, log),
                _ => todo!("Need to raise a error from here since non other supported"),
            },
            BlockKind::Reference => match block.type_field {
                BlockType::ActionGroup => self.process_action_group(block, er, log),
                BlockType::Assertion => self.process_action_group(block, er, log),
                _ => todo!("Need to raise a error from here since non other supported"),
            },
        }
            .await?;
        Ok(())
    }

    async fn process_in_memory_loop(&self, block: &case_block::Model, er: &ExecutionRequest, log: Option<&ItemLog>) -> () {
        ()
    }

    async fn process_datatable_loop(&self, block: &case_block::Model, er: &ExecutionRequest, log: Option<&ItemLog>) {}

    async fn process_condition(&self, block: &case_block::Model, er: &ExecutionRequest, log: Option<&ItemLog>) {}

    async fn process_action_group(&self, block: &case_block::Model, er: &ExecutionRequest,
                                  log: Option<&ItemLog>) -> EngineResult<()> {
        info!("Starting processing {block_id}", block_id = block.id);
        let controller = ActionController::new(self.db, self.drive.clone(), self.cli.clone());
        let result = controller
            .execute(block.reference.unwrap_or_default(), er, log)
            .await?;
        Ok(result)
    }
}
