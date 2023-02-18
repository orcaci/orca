use std::error::Error;

use actix_web::{HttpResponse, web};
use actix_web::web::Path;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, IntoActiveModel, NotSet, QueryFilter, QueryOrder, Value};
use sea_orm::ActiveValue::Set;
use sea_orm::prelude::Uuid;

use cerium::error::web::OrcaError;
use entity::app::app;
use entity::prelude::group;

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
    let groups = group::Entity::find().filter(group::Column::AppId.eq(app_id))
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


