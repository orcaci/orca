use sea_orm_migration::prelude::*;

use entity::common::{attachment, tag, tag_entity};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        //******************  Tag  ******************
        manager.create_table(Table::create()
                .table(tag::Entity)
                .if_not_exists()
                .col(ColumnDef::new(tag::Column::Id).uuid().not_null().primary_key())
                .col(ColumnDef::new(tag::Column::Name).string().not_null())
                .col(ColumnDef::new(tag::Column::TagType).string().not_null())
                .to_owned(),
        ).await?;
        //******************  Tag Entity Mapping  ******************
        manager.create_table(Table::create()
                .table(tag_entity::Entity)
                .if_not_exists()
                .col(ColumnDef::new(tag_entity::Column::Id).uuid().not_null().primary_key())
                .col(ColumnDef::new(tag_entity::Column::TagId).uuid().not_null())
                .col(ColumnDef::new(tag_entity::Column::EntityId).uuid().not_null())
                .col(ColumnDef::new(tag_entity::Column::EntityType).string().not_null())
                .to_owned(),
        ).await?;


        //******************  Application  ******************
        manager.create_table(Table::create()
                .table(attachment::Entity)
                .if_not_exists()
                .col(ColumnDef::new(attachment::Column::Id).integer().not_null().primary_key().auto_increment())
                .col(ColumnDef::new(attachment::Column::Name).string())
                .col(ColumnDef::new(attachment::Column::Desc).string().not_null())
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
