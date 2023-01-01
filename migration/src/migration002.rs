use sea_orm_migration::prelude::*;
use sea_orm_migration::sea_orm::ActiveValue::Set;
use entity::prelude::{case, case_block, data_binding};
use entity::prelude::case_block::{BlockKind, BlockType};
use crate::sea_orm::ActiveModelTrait;


#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {



        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        Ok(())
    }
}
