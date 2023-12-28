use actix_web::{HttpResponse, web};
use actix_web::web::Path;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, EntityTrait, IntoActiveModel, QueryFilter, QueryOrder};
use sea_orm::ActiveValue::Set;
use sea_orm::prelude::Uuid;

use cerium::error::web::OrcaError;
use entity::test::ui::action::action as action_model;
use entity::test::ui::profile::{data as profile_data, profile};

use crate::route::app::action;
use crate::utils::config::CONFIG;

/// profile_config - profile config will have all the endpoint to Handle the
/// profile and its data
pub fn profile_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/profile")
            .route("/", web::get().to(list_profile))
            .route("/", web::post().to(create_profile))
            .service(
                web::scope("/{profile_id}")
                    .route("/", web::put().to(update_profile))
                    .route("/", web::delete().to(delete_profile))
                    .route("/data/batch/", web::post().to(update_profile))
                    .route("/data/{data_id}/", web::delete().to(delete_profile_data))
                    .configure(action::action_config)
            )
    );

}


/// list_profile - list all the Profile that is Binded with Current Application
async fn list_profile(path: Path<Uuid>) -> Result<HttpResponse, OrcaError> {
    let app_id = path.into_inner();
     let _filter = Condition::all()
                .add(profile::Column::AppId.eq(app_id));
    let profiles = profile::Entity::find().filter(_filter)
        .order_by_asc(profile::Column::Name).all(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(profiles))
}


/// create_profile - This will New Profile for the specific Application in Orca
async fn create_profile(path: Path<Uuid>, mut body: web::Json<profile::Model>) -> Result<HttpResponse, OrcaError> {
    let app_id = path.into_inner();
    body.id = Uuid::new_v4();
    body.app_id = app_id;
    let _profile = body.clone().into_active_model();
    let result = _profile.insert(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(result))
}

/// update_profile - this will update the existing profile information in Orca
async fn update_profile(path: Path<(Uuid, Uuid)>, body: web::Json<profile::Model>) -> Result<HttpResponse, OrcaError> {
    let (app_id, profile_id) = path.into_inner();
    let _profile = profile::Entity::find_by_id(profile_id).one(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    if let Some(prf) = _profile {
        let mut prf: profile::ActiveModel = prf.into();
        prf.name = Set(body.name.to_owned());
        prf.description = Set(body.description.to_owned());
        let _ = prf.save(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
        /// TODO: response is wrong status code
        return Ok(HttpResponse::NoContent().finish());
    }
    Ok(HttpResponse::NoContent().finish())
}

/// delete_profile - this will delete existing profile in Application Application in Orca
async fn delete_profile(path: Path<(Uuid, Uuid)>) -> Result<HttpResponse, OrcaError> {
    let (_, profile_id) = path.into_inner();
    let _profile = profile::Entity::delete_by_id(profile_id).exec(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    Ok(HttpResponse::NoContent().finish())
}


/// delete_profile_data - this will delete existing profile data in Application Application in Orca
async fn delete_profile_data(path: Path<(Uuid, Uuid, Uuid)>) -> Result<HttpResponse, OrcaError> {
    let (_, profile_id, data_id) = path.into_inner();
    let _profile_data = profile_data::Entity::delete_by_id(data_id).exec(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
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


