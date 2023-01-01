pub(crate) mod ws;

use std::fmt::Error;
use actix_web::{http, HttpResponse, Responder, web};
use serde_json::{Value};
use serde::{Deserialize, Serialize};

// pub(crate) mod admin;
// pub(crate) mod ws;
// pub(crate) mod profile;
// pub(crate) mod case;
// pub(crate) mod auth;
// pub(crate) mod table;

/// general_config - this will register all the endpoint in common route
pub fn general_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
    web::scope("/ping").route("", web::get().to(ping))
    );
}

/// ping - Api route will use the verify the application is up and running
/// uses Ping-Pong
async fn ping() -> HttpResponse {
    HttpResponse::Ok().body("Pong!")
}