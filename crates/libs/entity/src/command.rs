//! SeaORM Entity. Generated by sea-orm-codegen 0.6.0

use sea_orm::entity::prelude::*;
use sea_orm::EntityTrait;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Deserialize, Serialize)]
#[sea_orm(table_name = "command")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: i32,
    pub kind: String,
    pub table_name: String,
    pub command: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
