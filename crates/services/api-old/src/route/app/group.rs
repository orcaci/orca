use actix_web::{HttpResponse, web};
use actix_web::web::Path;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, EntityTrait, IntoActiveModel, QueryFilter, QueryOrder};
use sea_orm::ActiveValue::Set;
use sea_orm::prelude::Uuid;

use cerium::error::web::OrcaError;
use entity::prelude::group;
use entity::prelude::group::ActionGroupKind;
use entity::test::ui::action::action as action_model;

use crate::route::app::action;
use crate::utils::config::CONFIG;

/// group_config - this will register all the endpoint in ACTION GROUP route
pub fn group_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/group")
            .route("/", web::get().to(get_groups))
            .route("/", web::post().to(create_group))
            .service(
                web::scope("/{group_id}")
                    .route("/", web::put().to(update_group))
                    .route("/", web::delete().to(delete_group))
                    .configure(action::action_config)
            )

    );

}


/// get_groups - list all the Action Group in Specific Application in the Orca Application
async fn get_groups(path: Path<Uuid>) -> Result<HttpResponse, OrcaError> {
    let app_id = path.into_inner();
     let _filter = Condition::all()
                .add(group::Column::AppId.eq(app_id))
                .add(group::Column::TypeField.eq(ActionGroupKind::ActionGroup));
    let groups = group::Entity::find().filter(_filter)
        .order_by_asc(group::Column::Name).all(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(groups))
}


/// create_group - This will create new Action Group in Application in Orca
async fn create_group(path: Path<Uuid>, mut body: web::Json<group::Model>) -> Result<HttpResponse, OrcaError> {
    let app_id = path.into_inner();
    body.id = Uuid::new_v4();
    body.app_id = app_id;
    let app = body.clone().into_active_model();
    let result = app.insert(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(result))
}

/// update_action_group - this will create new Application in Orca
async fn update_group(path: Path<(Uuid, Uuid)>, body: web::Json<group::Model>) -> Result<HttpResponse, OrcaError> {
    let (app_id, group_id) = path.into_inner();
    let group = group::Entity::find_by_id(group_id).one(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    if let Some(grp) = group {
        let mut grp: group::ActiveModel = grp.into();
        grp.name = Set(body.name.to_owned());
        grp.description = Set(body.description.to_owned());
        let grp = grp.save(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
        /// TODO: response is wrong status code
        return Ok(HttpResponse::NoContent().finish());
    }
    Ok(HttpResponse::NoContent().finish())
}

/// delete_action_group - this will delete Action Group in Application Application in Orca
async fn delete_group(path: Path<(Uuid, Uuid)>) -> Result<HttpResponse, OrcaError> {
    let (app_id, group_id) = path.into_inner();
    let group = group::Entity::find_by_id(group_id).one(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    if let Some(grp) = group {
        let grp: group::ActiveModel = grp.into();
        grp.delete(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
        return Ok(HttpResponse::NoContent().finish());
    }
    Ok(HttpResponse::NoContent().finish())
}


/// batch_update_action - This will update batch Action Group in Application in Orca
async fn batch_update_action(path: Path<(Uuid, Uuid)>, mut body: web::Json<Vec<action_model::Model>>) -> Result<HttpResponse, OrcaError> {
    let (_, group_id) = path.into_inner();
    let db = &CONFIG.get().await.db_client;

    let actions : Vec<action_model::ActiveModel>  = body.iter_mut().map(|item| {
        item.id = Uuid::new_v4();
        item.action_group_id = group_id;
        let _item =  item.clone().into_active_model();
        // _item.save(db).await.expect("TODO: panic message");
        return _item;
    }).collect();

    for action in actions{
        action.save(db).await.expect("TODO: panic message");
    }


    // let group = group::Entity::find_by_id(group_id).one(&CONFIG.get().await.db_client).await
    //     .expect("TODO: panic message");
    // if let Some(grp) = group {
    //     let grp: group::ActiveModel = grp.into();
    //     grp.delete(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    //     return Ok(HttpResponse::NoContent().finish());
    // }
    Ok(HttpResponse::NoContent().finish())
}


