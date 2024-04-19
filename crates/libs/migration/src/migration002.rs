use std::vec;

use sea_orm_migration::prelude::*;
use sea_orm_migration::sea_orm::ActiveValue::Set;

use entity::admin::user::Model;
use entity::app::app;
use entity::prelude::{case, case_block};
use entity::prelude::case_block::{BlockKind, BlockType};
use entity::prelude::group::ActionGroupKind;
use entity::prelude::target::ActionTargetKind;
use entity::test::ui::action::{action, group as action_group};
use entity::test::ui::action::action::ActionKind;
use entity::test::ui::action::data::ActionDataKind;

use crate::sea_orm::{ActiveModelTrait, EntityTrait, InsertResult};
use crate::sea_orm::prelude::Uuid;

#[derive(DeriveMigrationName)]
pub struct Migration;

/// Migration 2 will have all the seed data need for application to startup with
/// this will have current sead data
#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        /// create Seed User for Admin user
        let user_am = entity::admin::user::ActiveModel {
            id: Set("system".to_string()),
            name: Set("Bot User".to_string()),
            first_name: Set("Bot User".to_string()),
            email: Set("system@orcaci.dev".to_string()),
            created_at: Default::default(),
            updated_at: Default::default(),
            created_by: Set(Some("system".to_string())),
            updated_by: Set(Some("system".to_string())),
            ..Default::default()
        };
        let _usr: Model = user_am.insert(db).await?;

        /// create Seed User for Admin user
        let user_am = entity::admin::user::ActiveModel {
            id: Set("user1".to_string()),
            name: Set("user1".to_string()),
            first_name: Set("user1".to_string()),
            email: Set("user1@orcaci.dev".to_string()),
            created_by: Set(Some("system".to_string())),
            updated_by: Set(Some("system".to_string())),
            ..Default::default()
        };
        let usr: Model = user_am.insert(db).await?;

        let app_am = app::ActiveModel {
            id: Set(Uuid::new_v4()),
            name: Set("Wikipedia Testing".to_string()),
            description: Default::default(),
        };
        let app: app::Model = app_am.insert(db).await?;
        let action_g_am = action_group::ActiveModel {
            id: Set(Uuid::new_v4()),
            name: Set("Wikipedia Searching".to_string()),
            description: Set(Option::from(
                "This is Seeding application \
            the will be created on application start"
                    .to_string(),
            )),
            type_field: Set(ActionGroupKind::ActionGroup),
            app_id: Set(app.id.clone()),
        };
        let app_g: action_group::Model = action_g_am.insert(db).await?;

        let action_ms = vec![
            action::ActiveModel {
                id: Set(Uuid::new_v4()),
                description: Set(Some("Navigation to URL".to_string())),
                kind: Set(ActionKind::Open),
                data_kind: Set(Some(ActionDataKind::Static)),
                data_value: Set(Some("https://www.wikipedia.org/".to_string())),
                execution_order: Set(1),
                action_group_id: Set(app_g.clone().id),
                ..Default::default()
            }
                .insert(db)
                .await?,
            action::ActiveModel {
                id: Set(Uuid::new_v4()),
                description: Set(Some("Search for Ana de Armas".to_string())),
                kind: Set(ActionKind::Enter),
                data_kind: Set(Some(ActionDataKind::Static)),
                data_value: Set(Some("Ana de Armas".to_string())),
                target_kind: Set(Some(ActionTargetKind::Id)),
                target_value: Set(Some("searchInput".to_string())),
                execution_order: Set(2),
                action_group_id: Set(app_g.clone().id),
                ..Default::default()
            }
                .insert(db)
                .await?,
            action::ActiveModel {
                id: Set(Uuid::new_v4()),
                description: Set(Some("Search".to_string())),
                kind: Set(ActionKind::Click),
                target_kind: Set(Some(ActionTargetKind::Xpath)),
                target_value: Set(Some(
                    "//*[@id='search-form']/fieldset/button".to_string(),
                )),
                execution_order: Set(3),
                action_group_id: Set(app_g.clone().id),
                ..Default::default()
            }
                .insert(db)
                .await?,
        ];
        // let _action_m: InsertResult<action::ActiveModel> =
        //     action::Entity::insert_many(action_ms).exec(db).await?;
        /// check assert
        let assert_g_am = action_group::ActiveModel {
            id: Set(Uuid::new_v4()),
            name: Set("Wikipedia Assert".to_string()),
            description: Set(Option::from(
                "This is Seeding application \
            the will be created on application start"
                    .to_string(),
            )),
            type_field: Set(ActionGroupKind::Assertion),
            app_id: Set(app.clone().id),
        };
        let assert_g_m: action_group::Model = assert_g_am.insert(db).await?;

        let assert_action_ms = vec![action::ActiveModel {
            id: Set(Uuid::new_v4()),
            description: Set(Option::from("Verify the title".to_string())),
            kind: Set(ActionKind::VerifyText),
            data_kind: Set(Some(ActionDataKind::Static)),
            data_value: Set(Some("Ana de Armas".to_string())),
            target_kind: Set(Some(ActionTargetKind::Xpath)),
            target_value: Set(Some("//h1[@id='firstHeading']/span".to_string())),
            execution_order: Set(1),
            action_group_id: Set(assert_g_m.clone().id),
            ..Default::default()
        }];
        let _assert_action_m: InsertResult<action::ActiveModel> =
            action::Entity::insert_many(assert_action_ms)
                .exec(db)
                .await?;

        let case_am = case::ActiveModel {
            id: Set(Uuid::new_v4()),
            name: Set("Wikipedia Test Case 1".to_string()),
            description: Set(Some("Validate search Test Case".to_string())),
            app_id: Set(app.clone().id),
        };
        let case_m: case::Model = case_am.insert(db).await?;
        let uuid1 = Uuid::new_v4();
        let uuid2 = Uuid::new_v4();
        let uuid3 = Uuid::new_v4();

        let case_blocks = vec![
            case_block::ActiveModel {
                id: Set(Uuid::new_v4()),
                execution_order: Set(1),
                kind: Set(BlockKind::Reference),
                type_field: Set(BlockType::ActionGroup),
                name: Set(Some(app_g.name.clone())),
                desc: Set(app_g.description.clone()),
                reference: Set(Some(app_g.clone().id)),
                case_id: Set(case_m.clone().id),
                ..Default::default()
            }
                .insert(db)
                .await?,
            // case_block::ActiveModel {
            //     id: Set(Uuid::new_v4()),
            //     execution_order: Set(2),
            //     kind: Set(BlockKind::Reference),
            //     type_field: Set(BlockType::Assertion),
            //     name: Set(Some(assert_g_m.name.clone())),
            //     desc: Set(assert_g_m.description.clone()),
            //     reference: Set(Some(assert_g_m.clone().id)),
            //     case_id: Set(case_m.clone().id),
            //     ..Default::default()
            // }
            //     .insert(db)
            //     .await?,
            // case_block::ActiveModel {
            //     id: Set(uuid1.clone()),
            //     execution_order: Set(3),
            //     kind: Set(BlockKind::SelfReference),
            //     name: Set(Some("This is a condition block".to_string())),
            //     desc: Set(Some("This is a condition block".to_string())),
            //     type_field: Set(BlockType::Condition),
            //     case_id: Set(case_m.clone().id),
            //     ..Default::default()
            // }
            //     .insert(db)
            //     .await?,
            // case_block::ActiveModel {
            //     id: Set(uuid2.clone()),
            //     execution_order: Set(1),
            //     kind: Set(BlockKind::SelfReference),
            //     name: Set(Some("This is yes block".to_string())),
            //     desc: Set(Some("This is yes condition block".to_string())),
            //     type_field: Set(BlockType::YesCase),
            //     parent_id: Set(Some(uuid1.clone())),
            //     case_id: Set(case_m.clone().id),
            //     ..Default::default()
            // }
            //     .insert(db)
            //     .await?,
            // case_block::ActiveModel {
            //     id: Set(uuid3.clone()),
            //     execution_order: Set(2),
            //     kind: Set(BlockKind::SelfReference),
            //     name: Set(Some("This is no block".to_string())),
            //     desc: Set(Some("This is no condition block".to_string())),
            //     type_field: Set(BlockType::NoCase),
            //     parent_id: Set(Some(uuid1.clone())),
            //     case_id: Set(case_m.clone().id),
            //     ..Default::default()
            // }
            //     .insert(db)
            //     .await?,
            // case_block::ActiveModel {
            //     id: Set(Uuid::new_v4()),
            //     execution_order: Set(1),
            //     kind: Set(BlockKind::Reference),
            //     name: Set(Some(app_g.name.clone())),
            //     desc: Set(app_g.description.clone()),
            //     type_field: Set(BlockType::ActionGroup),
            //     reference: Set(Some(app_g.clone().id)),
            //     parent_id: Set(Some(uuid2.clone())),
            //     case_id: Set(case_m.clone().id),
            //     ..Default::default()
            // }
            //     .insert(db)
            //     .await?,
        ];
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        Ok(())
    }
}
