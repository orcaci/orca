use actix_http::ContentEncoding;
use actix_service::Service;
use actix_web::{App, Error, http, HttpServer, middleware, web};
use actix_web::dev::ServiceRequest;
use actix_web::middleware::{Compress, ErrorHandlers, Logger};
use base::middleware::error;

use crate::server::middleware::request::RequestHandler;

mod core;
mod route;
mod server;


/// main - This is application server that will accessible with API
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(move|| {
        App::new()
            // .app_data(web::Data::new(rc.clone()))
            .wrap(Logger::default())
            .wrap(Compress::default())
            .wrap(RequestHandler::default())
            .wrap(ErrorHandlers::new().handler(
                http::StatusCode::INTERNAL_SERVER_ERROR,
                error::add_error_header,
            ))
            .service(
                web::scope("/v1")
                    .configure(route::general_config)
                    .configure(route::admin::admin_config)
                    .configure(route::case::test_case_config)

                    .configure(route::profile::profile_config)
            )
    })
    .bind("127.0.0.1:8090")?
    .run()
    .await
}
