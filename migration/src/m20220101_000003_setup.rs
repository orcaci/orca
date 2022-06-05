use entity::{user};
use sea_orm_migration::prelude::*;
use crate::sea_orm::Set;
// use crate::sea_orm::ActiveModelTrait;
// use crate::sea_orm::ColumnTrait;
// use crate::sea_orm::EntityTrait;
// use crate::sea_orm::QueryFilter;
// use crate::sea_orm::QueryOrder;

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20220101_000003_setup"
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();
        user::ActiveModel {
            name: Set("Vasanth Kumar".to_owned()),
            first_name: Set("Vasanth".to_owned()),
            email: Set("itsparser@gmail.com".to_owned()),
            is_active: Set(true),
            ..Default::default()
        }
        .insert(db)
        .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();
        user::Entity::find_by_id(1).one(&db).await
    }
}