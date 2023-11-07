//! SeaORM Entity. Generated by sea-orm-codegen 0.6.0

use sea_orm::entity::prelude::*;
use sea_orm::EntityTrait;
use serde::{Deserialize, Serialize};

use crate::prelude::target::ActionTargetKind;

#[derive(Debug, Clone, PartialEq, EnumIter, DeriveActiveEnum, Deserialize, Serialize)]
#[sea_orm(rs_type = "String", db_type = "String(Some(5))", enum_name = "element_create_type")]
pub enum ElementCreateType {
    #[sea_orm(string_value = "M")]
    Manual,
    #[sea_orm(string_value = "R")]
    Record,
}

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Deserialize, Serialize)]
#[sea_orm(table_name = "element")]
pub struct Model {
    #[serde(skip_deserializing)]
    #[sea_orm(primary_key)]
    pub id: i64,
    pub name: String,
    pub locator_value: String,
    pub element_type: Option<String>,
    pub created_type: ElementCreateType,
    pub locator_type: ActionTargetKind,
    pub screen_id: i64,
}


#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::screen::Entity",
        from = "Column::ScreenId",
        to = "super::screen::Column::Id"
    )]
    Screen,
}

// `Related` trait has to be implemented by hand
impl Related<super::screen::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Screen.def()
    }
}






impl ActiveModelBehavior for ActiveModel {}
