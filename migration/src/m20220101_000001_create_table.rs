use entity::{audit_log, profile, profile_data, role, role_scope, user, user_role, user_session};
use sea_orm_migration::prelude::*;

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20220101_000001_create_table"
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.create_table(
        Table::create().table(user::Entity).if_not_exists()
                .col(ColumnDef::new(user::Column::Id).integer().not_null().auto_increment().primary_key())
                .col(ColumnDef::new(user::Column::FirstName).text().not_null())
                .col(ColumnDef::new(user::Column::LastName).text())
                .col(ColumnDef::new(user::Column::Email).text().not_null())
                .col(ColumnDef::new(user::Column::IsActive).boolean().not_null().default(false))
                .col(ColumnDef::new(user::Column::Name).text().not_null())
                .col(ColumnDef::new(user::Column::Password).text().not_null())
                .to_owned()
        ).await?;
        manager.create_table(
        Table::create().table(role::Entity).if_not_exists()
                .col(ColumnDef::new(role::Column::Id).integer().not_null().auto_increment().primary_key())
                .col(ColumnDef::new(role::Column::Name).text().not_null())
                .col(ColumnDef::new(role::Column::Description).text())
                .to_owned()
        ).await?;
        manager.create_table(
        Table::create().table(user_role::Entity).if_not_exists()
                .col(ColumnDef::new(user_role::Column::RoleId).integer().not_null())
                .col(ColumnDef::new(user_role::Column::UserId).integer().not_null())
                .foreign_key(ForeignKey::create().name("fk-user-role-role-id").from_tbl(user_role::Entity).to_tbl(role::Entity).from_col(user_role::Column::RoleId).to_col(role::Column::Id))
                .foreign_key(ForeignKey::create().name("fk-user-role-user-id").from_tbl(user_role::Entity).to_tbl(user::Entity).from_col(user_role::Column::UserId).to_col(user::Column::Id))
                .to_owned()
        ).await?;
        manager.create_table(
        Table::create().table(role_scope::Entity).if_not_exists()
                .col(ColumnDef::new(role_scope::Column::Id).integer().not_null().auto_increment().primary_key())
                .col(ColumnDef::new(role_scope::Column::Name).text().not_null())
                .col(ColumnDef::new(role_scope::Column::Scope).text().not_null())
                .col(ColumnDef::new(role_scope::Column::RoleId).integer().not_null())
                .foreign_key(ForeignKey::create().name("fk-role-scope-role-id").from_tbl(role_scope::Entity).to_tbl(role::Entity).from_col(role_scope::Column::RoleId).to_col(role::Column::Id))
                .to_owned()
        ).await?;
        manager.create_table(
        Table::create().table(audit_log::Entity).if_not_exists()
                .col(ColumnDef::new(audit_log::Column::Id).integer().not_null().auto_increment().primary_key())
                .col(ColumnDef::new(audit_log::Column::Payload).text().not_null())
                .col(ColumnDef::new(audit_log::Column::Action).text().not_null())
                .col(ColumnDef::new(audit_log::Column::Event).text().not_null())
                .col(ColumnDef::new(audit_log::Column::ActedBy).integer().not_null())
                .col(ColumnDef::new(audit_log::Column::CreatedAt).timestamp().not_null())
                .foreign_key(ForeignKey::create().name("fk_audit_log_user_id").from_tbl(audit_log::Entity).to_tbl(user::Entity).from_col(audit_log::Column::ActedBy).to_col(user::Column::Id))
                .to_owned()
        ).await?;
        manager.create_table(
        Table::create().table(user_session::Entity).if_not_exists()
                .col(ColumnDef::new(user_session::Column::Id).integer().not_null().auto_increment().primary_key())
                .col(ColumnDef::new(user_session::Column::SessionId).text().not_null())
                .col(ColumnDef::new(user_session::Column::SessionType).text().not_null())
                .col(ColumnDef::new(user_session::Column::Email).text().not_null())
                .col(ColumnDef::new(user_session::Column::UserAgent).text().not_null())
                .col(ColumnDef::new(user_session::Column::UserId).integer().not_null())
                .col(ColumnDef::new(user_session::Column::ExpiresBy).timestamp().not_null())
                .foreign_key(ForeignKey::create().name("fk_user_session_user_id").from_tbl(user_session::Entity).to_tbl(user::Entity).from_col(user_session::Column::UserId).to_col(user::Column::Id))
                .to_owned()
        ).await?;
        manager.create_table(
            Table::create().table(profile::Entity).if_not_exists()
                .col(ColumnDef::new(profile::Column::Id).integer().not_null().auto_increment().primary_key())
                .col(ColumnDef::new(profile::Column::Name).text().not_null())
                .col(ColumnDef::new(profile::Column::IsDefault).boolean().not_null().default(false))
                .to_owned()
        ).await?;
        manager.create_table(
            Table::create().table(profile_data::Entity).if_not_exists()
                .col(ColumnDef::new(profile_data::Column::Id).integer().not_null().auto_increment().primary_key())
                .col(ColumnDef::new(profile_data::Column::Name).text().not_null())
                .col(ColumnDef::new(profile_data::Column::Value).text().not_null())
                .col(ColumnDef::new(profile_data::Column::ProfileId).integer().not_null())
                .foreign_key(ForeignKey::create().name("fk-profile-data").from(profile_data::Entity, profile_data::Column::ProfileId)
                                 .to(profile::Entity, profile::Column::Id)
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