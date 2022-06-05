use actix_web::{HttpRequest, HttpResponse, Responder, Scope, web};
use actix_web::web::Path;
use entity::{prelude::*, profile, profile_data, user};
use sea_orm::ActiveModelTrait;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use sea_orm::Set;
use serde::Deserialize;

use crate::server::context::request::RequestContext;

#[derive(Clone, Debug, PartialEq, Deserialize)]
pub struct AuthData {
    pub user_name: String,
    pub password: bool
}

/// profile_config - this will register all the endpoint in profile route
pub fn auth_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/auth")
            .route("/signin", web::post().to(signin))
            .route("/google", web::get().to(get_redirection_url))
            .route("/google/callback", web::post().to(signin))
            .route("/resend", web::post().to(signin))
    );

}
/// signin - will get username and password as payload
async fn signin(auth_data: web::Json<AuthData>) -> impl Responder {
    "Got Profile By ID"
}

/// get_redirection_url - get the redirection url for the google authentication
async fn get_redirection_url() -> impl Responder {
    let redirection_url = format!("https://");
    HttpResponse::Found().append_header(("location", redirection_url)).finish()
}