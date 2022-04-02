use actix_web::{web, Responder, Scope};
use base::utils::request::generate_success_response;

pub(crate) mod admin;
pub(crate) mod ws;

/// this will register all the endpoint in common route
pub(crate) fn register() -> Scope {
    web::scope("/health").route("", web::get().to(health))
}

async fn health() -> impl Responder {
    generate_success_response(None, None, None)
}
