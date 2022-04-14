use actix_web::{web, Responder, Scope};
use base::utils::request::generate_success_response;

pub(crate) mod admin;
pub(crate) mod ws;
pub(crate) mod profile;

/// general_config - this will register all the endpoint in common route
pub fn general_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
    web::scope("/health").route("", web::get().to(health))
    );
}


async fn health() -> impl Responder {
    println!("Running Request called");
    generate_success_response(None, None, None)
}
