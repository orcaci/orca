use sea_orm_migration::prelude::*;
use entity::app::app;
use entity::prelude::{case, case_block, data_binding};
use entity::test::ui::action::{action, data, group as action_group, target};


#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        //******************  Application  ******************
        manager.create_table(Table::create()
                    .table(app::Entity)
                    .if_not_exists()
                    .col(ColumnDef::new(app::Column::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(app::Column::Name).string().not_null())
                    .col(ColumnDef::new(app::Column::Description).string())
                    .to_owned(),
            ).await?;

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
                    .col(ColumnDef::new(case_block::Column::Kind).string().not_null())
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



        manager.create_table(Table::create()
                    .table(action_group::Entity)
                    .if_not_exists()
                    .col(ColumnDef::new(action_group::Column::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(action_group::Column::Name).string().not_null())
                    .col(ColumnDef::new(action_group::Column::Description).string().not_null())
                    .to_owned(),
            ).await?;


        manager.create_table(Table::create()
                    .table(action::Entity)
                    .if_not_exists()
                    .col(ColumnDef::new(action::Column::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(action::Column::Kind).string().not_null())
                    .col(ColumnDef::new(action::Column::ExecutionOrder).integer().not_null())
                    .col(ColumnDef::new(action::Column::Description).string().not_null())
                    .col(ColumnDef::new(action::Column::ActionGroupId).uuid().not_null())
                    .foreign_key(
                         ForeignKey::create()
                            .from(action::Entity, action::Column::ActionGroupId)
                            .to(action_group::Entity, action_group::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade)
                    )
                    .to_owned(),
            ).await?;

        manager.create_table(Table::create()
                    .table(target::Entity)
                    .if_not_exists()
                    .col(ColumnDef::new(target::Column::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(target::Column::Kind).string().not_null())
                    .col(ColumnDef::new(target::Column::Value).string().not_null())
                    .col(ColumnDef::new(target::Column::ActionId).uuid().not_null())
                    .foreign_key(
                         ForeignKey::create()
                            .from(target::Entity, target::Column::ActionId)
                            .to(action::Entity, action::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade)
                    )
                    .to_owned(),
            ).await?;

        manager.create_table(Table::create()
                    .table(data::Entity)
                    .if_not_exists()
                    .col(ColumnDef::new(data::Column::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(data::Column::Kind).string().not_null())
                    .col(ColumnDef::new(data::Column::Value).string().not_null())
                    .col(ColumnDef::new(data::Column::ActionId).uuid().not_null())
                    .foreign_key(
                         ForeignKey::create()
                            .from(data::Entity, data::Column::ActionId)
                            .to(action::Entity, action::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade)
                    )
                    .to_owned(),
            ).await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(app::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(case::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(case_block::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(data_binding::Entity).to_owned()).await?;

        manager.drop_table(Table::drop().table(action::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(target::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(data::Entity).to_owned()).await?;

        Ok(())
    }
}
