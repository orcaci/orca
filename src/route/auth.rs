use actix_web::{HttpRequest, HttpResponse, Responder, Scope, web};
use actix_web::{cookie::Cookie, web::Path};
use actix_web::cookie::time::Duration as CookieDuration;
use chrono::Duration;
use entity::{prelude::*, profile, profile_data, user};
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, Set};
use serde::Deserialize;

use crate::constant::metadata::user::AuthData;
use crate::core::error::OrcaResult;
use crate::server::context::request::RequestContext;
use crate::utils::jwt::JWTClaim;

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
async fn signin(auth_data: web::Json<AuthData>, req: HttpRequest) -> OrcaResult {
    let username = auth_data.clone().username;
    let host = req.uri().host().unwrap();
    let duration = Duration::days(5);
    let claim = JWTClaim::new(username, "AUTH".parse().unwrap(), duration, None);
    let jwt = claim.encode()?;
    let cookie = Cookie::build("_OUSI_", jwt)
        .domain(host).path("/").secure(true).max_age(CookieDuration::days(5))
            .http_only(true)
            .finish();
    Ok(HttpResponse::Ok().cookie(cookie).finish())
}

/// get_redirection_url - get the redirection url for the google authentication
async fn get_redirection_url() -> impl Responder {
    let redirection_url = format!("https://");
    HttpResponse::Found().append_header(("location", redirection_url)).finish()
}