use actix_web::{Responder, web};

use crate::core::utils::request::generate_success_response;

pub(crate) mod admin;
pub(crate) mod ws;
pub(crate) mod profile;
pub(crate) mod case;
pub(crate) mod auth;
pub(crate) mod table;

/// general_config - this will register all the endpoint in common route
pub fn general_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
    web::scope("/health").route("", web::get().to(health))
    );
}


async fn health() -> impl Responder {
    generate_success_response(None, None, None)
}
