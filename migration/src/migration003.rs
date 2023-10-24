use sea_orm_migration::prelude::*;

use entity::common::attachment;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        //******************  Application  ******************
        manager.create_table(Table::create()
                .table(attachment::Entity)
                .if_not_exists()
                .col(ColumnDef::new(attachment::Column::Id).uuid().not_null().primary_key())
                .col(ColumnDef::new(attachment::Column::Category).string().not_null())
                .col(ColumnDef::new(attachment::Column::Path).string().not_null())
                .col(ColumnDef::new(attachment::Column::ReferenceId).uuid())
                .col(ColumnDef::new(attachment::Column::Attachment).binary())
                .to_owned(),
        ).await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(attachment::Entity).to_owned()).await?;
        Ok(())
    }
}
