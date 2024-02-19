//! SeaORM Entity. Generated by sea-orm-codegen 0.6.0

use sea_orm::entity::prelude::*;
use sea_orm::EntityTrait;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, EnumIter, DeriveActiveEnum, Deserialize, Serialize)]
#[sea_orm(
    rs_type = "String",
    db_type = "String(Some(15))",
    enum_name = "block_kind"
)]
pub enum BlockKind {
    #[sea_orm(string_value = "Reference")]
    Reference,
    #[sea_orm(string_value = "SelfReference")]
    SelfReference,
    // #[sea_orm(string_value = "ValidationGroup")]
    // ValidationGroup,
}

#[derive(Debug, Clone, PartialEq, EnumIter, DeriveActiveEnum, Deserialize, Serialize)]
#[sea_orm(
    rs_type = "String",
    db_type = "String(Some(15))",
    enum_name = "block_type"
)]
pub enum BlockType {
    #[sea_orm(string_value = "InMemory")]
    InMemory,
    #[sea_orm(string_value = "DataTable")]
    DataTable,
    #[sea_orm(string_value = "ActionGroup")]
    ActionGroup,
    #[sea_orm(string_value = "Assertion")]
    Assertion,
    #[sea_orm(string_value = "Loop")]
    Loop,
    #[sea_orm(string_value = "Condition")]
    Condition,
    #[sea_orm(string_value = "YesCase")]
    YesCase,
    #[sea_orm(string_value = "NoCase")]
    NoCase,
    #[sea_orm(string_value = "Parallel")]
    Parallel,
    #[sea_orm(string_value = "Block")]
    Block,
}

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Deserialize, Serialize)]
#[sea_orm(table_name = "case_block")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    #[serde(skip_deserializing)]
    pub execution_order: i32,
    pub kind: BlockKind,
    // pub name: Option<String>,
    #[sea_orm(column_name = "type")]
    pub type_field: BlockType,
    pub reference: Option<Uuid>,
    pub parent_id: Option<Uuid>,

    #[serde(skip_deserializing)]
    pub case_id: Uuid,
    #[sea_orm(ignore)]
    pub children: Option<Vec<Model>>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::data_binding::Entity")]
    DataBinding,
    #[sea_orm(belongs_to = "Entity", from = "Column::Id", to = "Column::ParentId")]
    SelfReferencing,
    #[sea_orm(
        belongs_to = "super::case::Entity",
        from = "Column::CaseId",
        to = "super::case::Column::Id"
    )]
    Case,
}

// `Related` trait has to be implemented by hand
impl Related<super::data_binding::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::DataBinding.def()
    }
}

impl Related<super::case::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Case.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

pub struct SelfReferencingLink;

impl Linked for SelfReferencingLink {
    type FromEntity = Entity;

    type ToEntity = Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![Relation::SelfReferencing.def()]
    }
}
