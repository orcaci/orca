use actix_web::middleware::{Logger, ErrorHandlers, Compress};
use actix_web::{http, App, HttpServer};
use base::middleware::error;

mod core;
mod route;
mod server;
pub mod entity;


/// main - This is application server that will accessible with API
#[actix_web::main]
async fn main() -> std::io::Result<()> {

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .wrap(ErrorHandlers::new().handler(
                http::StatusCode::INTERNAL_SERVER_ERROR,
                error::add_error_header,
            ))
            .wrap(Compress::default())
            .service(route::register())
            .service(route::admin::register())
            .service(route::ws::register())
    })
    .bind("127.0.0.1:8090")?
    .run()
    .await
}
