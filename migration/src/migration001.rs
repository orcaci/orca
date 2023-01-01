use sea_orm_migration::prelude::*;
use entity::prelude::{case, case_block, data_binding};


#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.create_table(Table::create()
                    .table(case::Entity)
                    .if_not_exists()
                    .col(ColumnDef::new(case::Column::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(case::Column::Name).string().not_null())
                    .col(ColumnDef::new(case::Column::Description).string())
                    .to_owned(),
            ).await?;
        manager.create_table(Table::create()
                    .table(case_block::Entity)
                    .if_not_exists()
                    .col(ColumnDef::new(case_block::Column::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(case_block::Column::ExecutionOrder).integer().not_null())
                    .col(ColumnDef::new(case_block::Column::TypeField).string().not_null())
                    .col(ColumnDef::new(case_block::Column::Reference).string().not_null())
                    .col(ColumnDef::new(case_block::Column::ParentId).uuid())
                    // .foreign_key(
                    //      ForeignKey::create()
                    //         .from(case_block::Entity, case_block::Column::ParentId)
                    //         .to(case_block::Entity, case_block::Column::Id)
                    //         .on_delete(ForeignKeyAction::Cascade)
                    //         .on_update(ForeignKeyAction::Cascade)
                    // )
                    .to_owned(),
            ).await?;
        manager.create_table(Table::create()
                    .table(data_binding::Entity)
                    .if_not_exists()
                    .col(ColumnDef::new(data_binding::Column::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(data_binding::Column::Key).string().not_null())
                    .col(ColumnDef::new(data_binding::Column::Value).string().not_null())
                    .col(ColumnDef::new(data_binding::Column::Kind).string().not_null())
                    .col(ColumnDef::new(data_binding::Column::BlockId).uuid())
                    .foreign_key(
                         ForeignKey::create()
                            .from(data_binding::Entity, data_binding::Column::BlockId)
                            .to(case_block::Entity, case_block::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade)
                    )
                    .to_owned(),
            ).await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(case::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(case_block::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(data_binding::Entity).to_owned()).await?;

        Ok(())
    }
}
