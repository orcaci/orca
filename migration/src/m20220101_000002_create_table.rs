use entity::{profile_data, test_case, test_step, user};
use sea_orm_migration::prelude::*;

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20220101_000002_create_table"
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.create_table(
            Table::create().table(test_case::Entity).if_not_exists()
                .col(ColumnDef::new(test_case::Column::Id).integer().not_null().auto_increment().primary_key())
                .col(ColumnDef::new(test_case::Column::Name).text().not_null())
                .col(ColumnDef::new(test_case::Column::IsDeleted).boolean().not_null().default(false))
                .to_owned()
        ).await?;
        manager.create_table(
            Table::create().table(test_step::Entity).if_not_exists()
                .col(ColumnDef::new(test_step::Column::Id).integer().not_null().auto_increment().primary_key())
                .col(ColumnDef::new(test_step::Column::Command).text().not_null())
                .col(ColumnDef::new(test_step::Column::Target).text().not_null())
                .col(ColumnDef::new(test_step::Column::Value).text())
                .col(ColumnDef::new(test_step::Column::Output).text())
                .col(ColumnDef::new(test_step::Column::Desc).text())
                .col(ColumnDef::new(test_step::Column::ExectionOrder).integer().not_null())
                .col(ColumnDef::new(test_step::Column::TestCaseId).integer().not_null())
                .foreign_key(ForeignKey::create().name("fk-test-case").from(test_step::Entity, test_step::Column::TestCaseId)
                                 .to(test_case::Entity, test_case::Column::Id)
                                 .on_delete(ForeignKeyAction::Cascade)
                                 .on_update(ForeignKeyAction::Cascade))
                .to_owned()
        ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(user::Entity).to_owned())
            .await
    }
}