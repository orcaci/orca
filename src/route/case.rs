
use actix_web::{web, Responder, Scope, HttpRequest, HttpResponse};
use actix_web::web::Path;
use entity::{prelude::*, profile, profile_data, user};
use crate::server::context::request::RequestContext;
use sea_orm::ActiveModelTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use sea_orm::QueryFilter;
use sea_orm::ColumnTrait;
use sea_orm::Set;

/// profile_config - this will register all the endpoint in profile route
pub fn test_case_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/case")
            .route("/", web::get().to(get_cases))
            .route("/", web::post().to(create_case))
            .route("/{id}", web::get().to(get_profile))
            .route("/{id}", web::delete().to(get_profile))
            .route("/{id}/data/", web::post().to(get_profile))
            .route("/{id}/data/", web::get().to(get_profile))
            .route("/{id}/data/{data_id}", web::delete().to(get_profile))
    );

}

/// list all the test cases in the Orca Application
async fn get_cases() -> impl Responder {
    let request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let _profiles = profile::Entity::find().order_by_asc(profile::Column::Name).all(&db.conn).await;
    let response = match _profiles {
        Ok(_profile) => _profile,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    print!("{:?}", response);
    HttpResponse::Ok().json(response)
}

/// Create New test case
async fn create_case(profile: web::Json<profile::Profile>) -> impl Responder {
    let request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let _profile = profile.into_inner();
    let f = profile::ActiveModel {
        name: Set(_profile.name.to_owned()),
        is_default: Set(_profile.is_default.to_owned()),
        ..Default::default()
    }.insert(&db.conn).await;
    let f = match f {
        Ok(file) => file,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    HttpResponse::Created().json(f)
}
/// Get the Single profile Info with the data
async fn get_profile() -> impl Responder {
    "Got Profile By ID"
}