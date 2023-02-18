use sea_orm::{ActiveModelTrait, Database, DatabaseConnection, EntityTrait, ModelTrait, Set};
use sea_orm::prelude::Uuid;
use serde_json::json;

use entity::prelude::*;
use entity::prelude::case_block::{BlockKind, BlockType};
use entity::test::ui::action::{action, data, group, target};
use entity::test::ui::action::action::ActionKind;
use entity::test::ui::action::data::ActionDataKind;
use entity::test::ui::action::target::ActionTargetKind;

async fn connection() -> DatabaseConnection {
    Database::connect("postgres://root:root@localhost:5432/orca".to_string()).await.expect("Error unable to connect DB")
}


#[tokio::test]
async fn t0001_seeding_data() -> Result<(), sea_orm::DbErr> {
    let db = connection().await;

    let case001 = case::ActiveModel {
        id: Set(Uuid::new_v4()),
        name: Set("Login Validation testcase".to_owned()),
        description: Set(Some("Validate the login for the Applciation".to_owned())),
        ..Default::default()
    }.insert(&db).await?;

    let case_block = case_block::ActiveModel {
        id: Set(Uuid::new_v4()),
        execution_order: Set(1),
        kind: Set(BlockKind::Reference),
        type_field: Set(BlockType::ActionGroup),
        reference: Set("ACTION_GRP_001".to_owned()),
        parent_id: Set(Some(case001.id.clone())),
        ..Default::default()
    }.insert(&db).await?;

    let case_block2 = case_block::ActiveModel {
        id: Set(Uuid::new_v4()),
        execution_order: Set(2),
        kind: Set(BlockKind::Loop),
        type_field: Set(BlockType::DataTable),
        reference: Set("DATATABLE_001".to_owned()),
        parent_id: Set(Some(case001.id.clone())),
        ..Default::default()
    }.insert(&db).await?;

    let case_block2_1 = case_block::ActiveModel {
        id: Set(Uuid::new_v4()),
        execution_order: Set(1),
        kind: Set(BlockKind::Reference),
        type_field: Set(BlockType::ActionGroup),
        reference: Set("ACTION_GRP_001".to_owned()),
        parent_id: Set(Some(case_block2.id.clone())),
        ..Default::default()
    }.insert(&db).await?;
    Ok(())
}


#[tokio::test]
async fn t0002_seeding_action() -> Result<(), sea_orm::DbErr> {

    let db = connection().await;

    let _group001 = group::ActiveModel {
        id: Set(Uuid::new_v4()),
        name: Set("Login Action Group".to_owned()),
        description: Set(Some("login for the Application".to_owned())),
    }.insert(&db).await?;

    let _action001 = action::ActiveModel {
        id: Set(Uuid::new_v4()),
        execution_order: Set(1),
        description: Set("Click on Submit".to_string()),
        kind: Set(ActionKind::Enter),
        action_group_id: Set(_group001.id),
    }.insert(&db).await?;
    let _action001_data = data::ActiveModel {
        id: Set(Uuid::new_v4()),
        kind: Set(ActionDataKind::Static),
        value: Set("mani@gmail.com".to_string()),
        action_id: Set(_action001.id),
    }.insert(&db).await?;
    let _action001_target = target::ActiveModel {
        id: Set(Uuid::new_v4()),
        kind: Set(ActionTargetKind::Id),
        value: Set("#email".to_string()),
        action_id: Set(_action001.id),
    }.insert(&db).await?;


    let _action002 = action::ActiveModel {
        id: Set(Uuid::new_v4()),
        execution_order: Set(2),
        description: Set("Enter password".to_string()),
        kind: Set(ActionKind::Enter),
        action_group_id: Set(_group001.id),
    }.insert(&db).await?;
    let _action002_data = data::ActiveModel {
        id: Set(Uuid::new_v4()),
        kind: Set(ActionDataKind::Static),
        value: Set("password".to_string()),
        action_id: Set(_action002.id),
    }.insert(&db).await?;
    let _action002_target = target::ActiveModel {
        id: Set(Uuid::new_v4()),
        kind: Set(ActionTargetKind::Id),
        value: Set("#password".to_string()),
        action_id: Set(_action002.id),
    }.insert(&db).await?;


    let _action003 = action::ActiveModel {
        id: Set(Uuid::new_v4()),
        execution_order: Set(3),
        description: Set("click login".to_string()),
        kind: Set(ActionKind::Click),
        action_group_id: Set(_group001.id),
    }.insert(&db).await?;
    let _action003_target = target::ActiveModel {
        id: Set(Uuid::new_v4()),
        kind: Set(ActionTargetKind::Id),
        value: Set("#login".to_string()),
        action_id: Set(_action003.id),
    }.insert(&db).await?;


    Ok(())
}

#[tokio::test]
async fn validate_data() -> Result<(), sea_orm::DbErr> {
    let db = connection().await;
    let c = case::Entity::find_by_id("306b60ac-e27a-4a52-9245-22cee8bce095".parse().unwrap())
        .find_with_related(case_block::Entity)
        .all(&db).await?;
    eprintln!("{:#?}", c);
    for x in c.into_iter() {
        eprintln!("Main {:#?}", x.0);
        for y in x.1.into_iter() {
            eprintln!("Child  {:#?}", y.clone());
            let res = y.find_linked(case_block::SelfReferencingLink).all(&db).await?;
            // let res = case_block::Entity::find().all(&db).await?;
            eprintln!("child 2 {:#?}", res);
        }
    }
    Ok(())

}

