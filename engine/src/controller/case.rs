use log::{error, info};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder};
use sea_orm::prelude::Uuid;

use entity::prelude::case_block;
use entity::prelude::case_block::{BlockKind, BlockType};
use entity::test::ui::case::case;

use crate::controller::action::ActionController;
use crate::server::driver::UIHelper;

pub struct CaseController<'ccl>{
    db: &'ccl DatabaseConnection,
    drive: &'ccl UIHelper
}

impl<'ccl> CaseController<'ccl> {
    pub fn new(db: &'ccl DatabaseConnection, drive: &'ccl UIHelper) -> CaseController<'ccl> {
        Self{db, drive }
    }
    /// run_case - will execute the test case by the case ID
    pub async fn run_case(&self, id: Uuid) -> Result<(), sea_orm::DbErr> {
        let case_res = case::Entity::find_by_id(id).all(self.db).await?;
        if case_res.is_empty() {
            error!("Unable to find the Case - {:?}", id.clone());
            return Ok(());
        }
        let case: &case::Model = &case_res[0];
        info!("Start Processing Case - [[ {name} || {id} ]]", name=case.name, id=case.id);
        self.process(case).await?;
        Ok(())
    }

    /// process will get the block and execute in the batch based on the kind of the block
    pub async fn process(&self, case: &case::Model) -> Result<(), sea_orm::DbErr> {
        let mut block_page = case_block::Entity::find()
            .filter(case_block::Column::CaseId.eq(case.id))
            .order_by_asc(case_block::Column::ExecutionOrder).paginate(self.db, 10);
        while let Some(blocks) = block_page.fetch_and_next().await? {
            for block in blocks.into_iter() {
                self.switch_block(&block).await
            }
        }
        Ok(())
    }

    /// switch_block - function to switch the block based on the type and kind of the block
    async fn switch_block(&self, block: &case_block::Model){
        let result = match block.kind {
            BlockKind::Loop => {
                match block.type_field {
                    BlockType::InMemory => self.process_action_group(block),
                    BlockType::DataTable => self.process_action_group(block),
                    _ => todo!("Need to raise a error from here since non other supported")
                }

            }
            BlockKind::Condition => {
                match block.type_field {
                    BlockType::InMemory => self.process_action_group(block),
                    _ => todo!("Need to raise a error from here since non other supported")
                }
            }
            BlockKind::Reference => {
                match block.type_field {
                    BlockType::ActionGroup => self.process_action_group(block),
                    BlockType::Assertion => self.process_action_group(block),
                    _ => todo!("Need to raise a error from here since non other supported")
                }
            },
        }.await;
    }

    async fn process_in_memory_loop(&self, block: &case_block::Model) -> () {
        ()
    }

    async fn process_datatable_loop(&self, block: &case_block::Model){

    }

    async fn process_condition(&self, block: &case_block::Model){

    }

    async fn process_action_group(&self, block: &case_block::Model) -> () {
        info!("Starting processing {block_id}", block_id=block.id);
        ActionController::new(self.db, self.drive).execute(block.reference.unwrap()).await
            .expect("failed on error")
    }
}

