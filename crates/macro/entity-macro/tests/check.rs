

mod check {
}


#[cfg(test)]
mod tests {
    // use sea_orm::{ActiveModelBehavior, DeriveEntityModel, DeriveRelation, EnumIter};
    use sea_orm::prelude::{DateTimeWithTimeZone, Uuid};
    use entity_macro::MyDerive;
    use sea_orm::entity::prelude::*;
    use sea_orm::EntityTrait;
    use serde::{Deserialize, Serialize};

    // #[derive(MyDerive, Debug)]
    // struct CaseController {
    //     _name: String,
    //     _age: i32,
    #[derive(Clone, Debug, PartialEq, MyDerive, DeriveEntityModel, Deserialize, Serialize)]
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


    #[test]
    fn dry_run_test_controller() {
        let c = Model{_name: "mani".to_string(), _age: 32};
        println!("got the controller, c = {:?}", c);
    }
}