use sea_orm_migration::prelude::*;

use entity::admin::user;
use entity::app::app;
use entity::command;
use entity::prelude::{case, case_block, data_binding};
use entity::test::{
    datatable, field,
    profile::{data as profile_data, profile},
};
use entity::test::ui::action::{action, data, group as action_group, target};
use entity::test::ui::log::item_log;
use entity::test::ui::request;
use entity::test::ui::suit::{suite, suite_block};

use crate::sea_orm::{ConnectionTrait, Statement};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        //******************  Admin  ******************

        manager
            .create_table(
                Table::create()
                    .table(user::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(user::Column::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(user::Column::Name).string().not_null())
                    .col(ColumnDef::new(user::Column::FirstName).string().not_null())
                    .col(ColumnDef::new(user::Column::LastName).string())
                    .col(ColumnDef::new(user::Column::Email).string().unique_key().not_null())
                    .col(ColumnDef::new(user::Column::ProfileUrl).string())

                    .col(ColumnDef::new(user::Column::CreatedAt).timestamp_with_time_zone().default(Expr::current_timestamp()).not_null())
                    .col(ColumnDef::new(user::Column::UpdatedAt).timestamp_with_time_zone().default(Expr::current_timestamp()).not_null())
                    .col(ColumnDef::new(user::Column::DeletedAt).timestamp_with_time_zone())
                    .col(ColumnDef::new(user::Column::CreatedBy).string())
                    .col(ColumnDef::new(user::Column::UpdatedBy).string())
                    .foreign_key(
                        ForeignKey::create()
                            .from(user::Entity, user::Column::CreatedBy)
                            .to(user::Entity, user::Column::Id)
                            .on_delete(ForeignKeyAction::NoAction)
                            .on_update(ForeignKeyAction::NoAction),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(user::Entity, user::Column::UpdatedBy)
                            .to(user::Entity, user::Column::Id)
                            .on_delete(ForeignKeyAction::NoAction)
                            .on_update(ForeignKeyAction::NoAction),
                    )
                    .to_owned(),
            )
            .await?;

        //******************  Application  ******************
        manager
            .create_table(
                Table::create()
                    .table(app::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(app::Column::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(app::Column::Name).string().not_null())
                    .col(ColumnDef::new(app::Column::Description).string())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(action_group::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(action_group::Column::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(action_group::Column::Name)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(action_group::Column::TypeField)
                            .string()
                            .not_null(),
                    )
                    .col(ColumnDef::new(action_group::Column::Description).string())
                    .col(
                        ColumnDef::new(action_group::Column::AppId)
                            .uuid()
                            .not_null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(action_group::Entity, action_group::Column::AppId)
                            .to(app::Entity, app::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(action::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(action::Column::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(action::Column::Kind).string().not_null())
                    .col(
                        ColumnDef::new(action::Column::ExecutionOrder)
                            .integer()
                            .not_null(),
                    )
                    .col(ColumnDef::new(action::Column::Description).string())
                    .col(ColumnDef::new(action::Column::TargetKind).string())
                    .col(ColumnDef::new(action::Column::TargetValue).string())
                    .col(ColumnDef::new(action::Column::DataKind).string())
                    .col(ColumnDef::new(action::Column::DataValue).string())
                    .col(
                        ColumnDef::new(action::Column::ActionGroupId)
                            .uuid()
                            .not_null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(action::Entity, action::Column::ActionGroupId)
                            .to(action_group::Entity, action_group::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(case::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(case::Column::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(case::Column::Name).string().not_null())
                    .col(ColumnDef::new(case::Column::Description).string())
                    .col(ColumnDef::new(case::Column::AppId).uuid().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(case::Entity, case::Column::AppId)
                            .to(app::Entity, app::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(case_block::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(case_block::Column::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(case_block::Column::ExecutionOrder)
                            .integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(case_block::Column::TypeField)
                            .string()
                            .not_null(),
                    )
                    .col(ColumnDef::new(case_block::Column::Kind).string().not_null())
                    .col(ColumnDef::new(case_block::Column::Name).string())
                    .col(ColumnDef::new(case_block::Column::Desc).string())
                    .col(ColumnDef::new(case_block::Column::Reference).uuid())
                    .col(ColumnDef::new(case_block::Column::ParentId).uuid())
                    .col(ColumnDef::new(case_block::Column::CaseId).uuid().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(case_block::Entity, case_block::Column::CaseId)
                            .to(case::Entity, case::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        // manager.alter_table(
        //     Table::alter().table(case_block::Entity)
        //         .add_column(ColumnDef::new(case_block::Column::Name).string())
        //         .to_owned(),
        // ).await?;

        manager
            .create_table(
                Table::create()
                    .table(data_binding::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(data_binding::Column::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(data_binding::Column::Key)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(data_binding::Column::Value)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(data_binding::Column::Kind)
                            .string()
                            .not_null(),
                    )
                    .col(ColumnDef::new(data_binding::Column::BlockId).uuid())
                    .foreign_key(
                        ForeignKey::create()
                            .from(data_binding::Entity, data_binding::Column::BlockId)
                            .to(case_block::Entity, case_block::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(command::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(command::Column::Id)
                            .integer()
                            .auto_increment()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(command::Column::Kind).string().not_null())
                    .col(
                        ColumnDef::new(command::Column::TableName)
                            .string()
                            .not_null(),
                    )
                    .col(ColumnDef::new(command::Column::Command).string().not_null())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(datatable::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(datatable::Column::Id)
                            .integer()
                            .not_null()
                            .primary_key()
                            .auto_increment(),
                    )
                    .col(ColumnDef::new(datatable::Column::Name).string().not_null())
                    .col(
                        ColumnDef::new(datatable::Column::TableName)
                            .string()
                            .not_null(),
                    )
                    .col(ColumnDef::new(datatable::Column::Description).string())
                    .col(ColumnDef::new(datatable::Column::AppId).uuid().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(datatable::Entity, datatable::Column::AppId)
                            .to(app::Entity, app::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(field::Entity)
                    .if_not_exists()
                    .col(ColumnDef::new(field::Column::FieldId).string().not_null())
                    .col(ColumnDef::new(field::Column::TableId).integer().not_null())
                    .col(ColumnDef::new(field::Column::Name).string().not_null())
                    .col(ColumnDef::new(field::Column::Kind).string().not_null())
                    .col(ColumnDef::new(field::Column::Option).json())
                    .foreign_key(
                        ForeignKey::create()
                            .from(field::Entity, field::Column::TableId)
                            .to(datatable::Entity, datatable::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;
        manager
            .get_connection()
            .execute(Statement::from_string(
                manager.get_database_backend(),
                "alter table field add constraint com_key_id primary key (field_id, table_id)",
            ))
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(profile::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(profile::Column::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(profile::Column::Name).string().not_null())
                    .col(ColumnDef::new(profile::Column::Description).string())
                    .col(ColumnDef::new(profile::Column::AppId).uuid().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(profile::Entity, profile::Column::AppId)
                            .to(app::Entity, app::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(profile_data::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(profile_data::Column::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(profile_data::Column::Key)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(profile_data::Column::Value)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(profile_data::Column::ValueType)
                            .string()
                            .not_null(),
                    )
                    .col(ColumnDef::new(profile_data::Column::Description).string())
                    .col(
                        ColumnDef::new(profile_data::Column::ProfileId)
                            .uuid()
                            .not_null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(profile_data::Entity, profile_data::Column::ProfileId)
                            .to(profile::Entity, profile::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(suite::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(suite::Column::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(suite::Column::Name).string().not_null())
                    .col(ColumnDef::new(suite::Column::Description).string())
                    .col(ColumnDef::new(suite::Column::AppId).uuid().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(suite::Entity, suite::Column::AppId)
                            .to(app::Entity, app::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(suite_block::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(suite_block::Column::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(suite_block::Column::ExecutionOrder)
                            .integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(suite_block::Column::TypeField)
                            .string()
                            .not_null(),
                    )
                    .col(ColumnDef::new(suite_block::Column::Reference).uuid())
                    .col(
                        ColumnDef::new(suite_block::Column::SuiteId)
                            .uuid()
                            .not_null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(suite_block::Entity, suite_block::Column::SuiteId)
                            .to(suite::Entity, suite::Column::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(item_log::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(item_log::Column::Id)
                            .integer()
                            .not_null()
                            .primary_key().auto_increment(),
                    )
                    .col(
                        ColumnDef::new(item_log::Column::ErId)
                            .integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(item_log::Column::RefId)
                            .uuid(),
                    )
                    .col(
                        ColumnDef::new(item_log::Column::RefType)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(item_log::Column::StepId)
                            .uuid()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(item_log::Column::HasScreenshot)
                            .boolean()
                            .not_null().default(false),
                    )
                    .col(
                        ColumnDef::new(item_log::Column::HasRecording)
                            .boolean()
                            .not_null().default(false),
                    )
                    .col(
                        ColumnDef::new(item_log::Column::ExecutionTime)
                            .integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(item_log::Column::Status)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(item_log::Column::LogId)
                            .integer(),
                    )
                    .col(ColumnDef::new(item_log::Column::CreatedBy).string().not_null())
                    .col(ColumnDef::new(item_log::Column::CreatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(item_log::Column::FinishedAt).timestamp_with_time_zone().not_null())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(request::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(request::Column::Id)
                            .integer()
                            .not_null()
                            .primary_key().auto_increment(),
                    )
                    .col(
                        ColumnDef::new(request::Column::Description)
                            .string(),
                    )
                    .col(
                        ColumnDef::new(request::Column::IsDryRun)
                            .boolean().default(false),
                    )
                    .col(
                        ColumnDef::new(request::Column::RefType)
                            .string().not_null(),
                    )
                    .col(
                        ColumnDef::new(request::Column::RefId)
                            .uuid()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(request::Column::Kind)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(request::Column::Status)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(request::Column::Args)
                            .json(),
                    )
                    .col(
                        ColumnDef::new(request::Column::LogId)
                            .integer(),
                    )
                    .col(ColumnDef::new(request::Column::CreatedBy).string().not_null())
                    .col(ColumnDef::new(request::Column::CreatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(request::Column::UpdatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(request::Column::FinishedAt).timestamp_with_time_zone().not_null())
                    .to_owned(),
            )
            .await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(app::Entity).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(case::Entity).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(case_block::Entity).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(data_binding::Entity).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(action::Entity).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(target::Entity).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(data::Entity).to_owned())
            .await?;

        Ok(())
    }
}
