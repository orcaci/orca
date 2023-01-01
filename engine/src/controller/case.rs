

use log::{error, info};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, ModelTrait, PaginatorTrait, QueryFilter, QueryOrder};
use sea_orm::prelude::Uuid;
use entity::prelude::case_block;
use entity::prelude::case_block::{BlockKind, BlockType};
use entity::test::ui::case::case;

pub struct CaseController<'ccl>{
    db: &'ccl DatabaseConnection
}

impl<'ccl> CaseController<'ccl> {
    pub fn new(db: &DatabaseConnection) -> CaseController<'ccl> {
        Self{db}
    }
    /// run_case - will execute the test case by the case ID
    pub async fn run_case(&self, id: Uuid) -> Result<(), sea_orm::DbErr> {
        let case_res = case::Entity::find_by_id(id).all(self.db).await?;
        if case_res.is_empty() {
            error!("Unable to find the Case - {:?}", id.clone());
            return Ok(());
            todo!("Need to raise a Error from here for now")
        }
        let case = &case_res[0];
        info!("Start Processing Case - [[ {name} || {id} ]]", name=case.name, id=case.id);
        self.process(id).await?;
        Ok(())
    }

    /// process will get the block and execute in the batch based on the kind of the block
    pub async fn process(&self, id: Uuid) -> Result<(), sea_orm::DbErr> {
        let mut block_page = case_block::Entity::find()
            .filter(case_block::Column::ParentId.eq(id))
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
                    BlockType::ValidationGroup => self.process_action_group(block),
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
        let b = block.find_linked(case_block::SelfReferencingLink).all(self.db).await.expect("");
    }
}

