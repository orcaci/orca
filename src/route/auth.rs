use actix_web::{HttpRequest, HttpResponse, Responder, Scope, web};
use actix_web::web::Path;
use entity::{prelude::*, profile, profile_data, user};
use sea_orm::ActiveModelTrait;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use sea_orm::Set;

use crate::server::context::request::RequestContext;

/// profile_config - this will register all the endpoint in profile route
pub fn auth_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/auth")
            .route("/google", web::get().to(get_profile))
            .route("/google/callback", web::post().to(get_profile))
            .route("/signin", web::post().to(get_profile))
            .route("/resend", web::post().to(get_profile))
    );

}
/// Get the Single profile Info with the data
async fn get_profile() -> impl Responder {
    "Got Profile By ID"
}