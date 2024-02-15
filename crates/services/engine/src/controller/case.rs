use sea_orm::prelude::Uuid;
use sea_orm::{
    ColumnTrait, DatabaseTransaction, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder,
};
use tracing::{error, info};
use cerium::client::Client;

use cerium::client::driver::web::WebDriver;
use entity::prelude::case::Entity;
use entity::prelude::case_block;
use entity::prelude::case_block::{BlockKind, BlockType};
use entity::test::ui::case::case;

use crate::controller::action::ActionController;
use crate::error::EngineResult;

pub struct CaseController<'ccl> {
    db: &'ccl DatabaseTransaction,
    cli: Client,
    drive: WebDriver,
}

impl<'ccl> CaseController<'ccl> {
    pub fn new(db: &'ccl DatabaseTransaction, drive: WebDriver, cli: Client) -> CaseController<'ccl> {
        Self { db, drive, cli}
    }
    /// run_case - will execute the test case by the case ID
    pub async fn run_case(&self, id: Uuid) -> EngineResult<()> {
        let case_res = Entity::find_by_id(id).one(self.db).await?;
        if case_res.is_none() {
            error!("Unable to find the Case - {:?}", id.clone());
            return Ok(());
        }
        let case: &case::Model = &case_res.unwrap();
        info!(
            "Start Processing Case - [[ {name} || {id} ]]",
            name = case.name,
            id = case.id
        );
        self.process(case).await?;
        Ok(())
    }

    /// process will get the block and execute in the batch based on the kind of the block
    pub async fn process(&self, case: &case::Model) -> EngineResult<()> {
        let mut block_page = case_block::Entity::find()
            .filter(case_block::Column::CaseId.eq(case.id))
            .order_by_asc(case_block::Column::ExecutionOrder)
            .paginate(self.db, 10);
        while let Some(blocks) = block_page.fetch_and_next().await? {
            for block in blocks.into_iter() {
                self.switch_block(&block).await?;
            }
        }
        Ok(())
    }

    /// switch_block - function to switch the block based on the type and kind of the block
    async fn switch_block(&self, block: &case_block::Model) -> EngineResult<()> {
        let result = match block.kind {
            // BlockKind::Loop => match block.type_field {
            //     BlockType::InMemory => self.process_action_group(block),
            //     BlockType::DataTable => self.process_action_group(block),
            //     _ => todo!("Need to raise a error from here since non other supported"),
            // },
            BlockKind::SelfReference => match block.type_field {
                BlockType::Condition => self.process_action_group(block),
                BlockType::YesCase => self.process_action_group(block),
                BlockType::NoCase => self.process_action_group(block),
                BlockType::Loop => self.process_action_group(block),
                _ => todo!("Need to raise a error from here since non other supported"),
            },
            BlockKind::Reference => match block.type_field {
                BlockType::ActionGroup => self.process_action_group(block),
                BlockType::Assertion => self.process_action_group(block),
                _ => todo!("Need to raise a error from here since non other supported"),
            },
        }
        .await?;
        Ok(())
    }

    async fn process_in_memory_loop(&self, block: &case_block::Model) -> () {
        ()
    }

    async fn process_datatable_loop(&self, block: &case_block::Model) {}

    async fn process_condition(&self, block: &case_block::Model) {}

    async fn process_action_group(&self, block: &case_block::Model) -> EngineResult<()> {
        info!("Starting processing {block_id}", block_id = block.id);
        let controller = ActionController::new(self.db, self.drive.clone(), self.cli.clone());
        let result = controller.execute(block.reference.unwrap_or_default()).await?;
        Ok(result)
    }
}
