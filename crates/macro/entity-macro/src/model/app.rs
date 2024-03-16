
use sea_orm::entity::prelude::*;
use sea_orm::prelude::async_trait::async_trait;
use serde::{Deserialize, Serialize};

#[async_trait]
trait  CustomActiveModelBehavior: ActiveModelBehavior {
    async fn before_save<C>(mut self, _db: &C, _insert: bool) -> Result<Self, DbErr>
        where
            C: ConnectionTrait,
    {
        self.updated_at = Set(Utc::now().into());
        Ok(self)
    }
}


#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Deserialize, Serialize)]
#[sea_orm(table_name = "application")]
pub struct Model {
    #[serde(skip_deserializing)]
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,

    pub created_by: Uuid,
    pub updated_by: Uuid,
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {
    // async fn before_save<C>(mut self, _db: &C, _insert: bool) -> Result<Self, DbErr>
    //     where
    //         C: ConnectionTrait,
    // {
    //     self.updated_at = Set(Utc::now().into());
    //     Ok(self)
    // }
}