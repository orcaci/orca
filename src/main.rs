use actix_web::{App, HttpServer, web};
use actix_web::middleware::{Compress, Logger};

use crate::core::middleware::{error, request::RequestHandler};
use crate::core::utils::logger;

mod constant;
mod route;
mod server;
mod core;

/// main - Orca Start here
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    return bootstrap_application_server().await;
}


/// bootstrap_application_server - will kick start the orca application server for the application
/// this will be responsible for all the application api request in Orca
async fn bootstrap_application_server() -> std::io::Result<()> {
    logger::init().expect("TODO: panic message");
    HttpServer::new(move|| {
        App::new()
            .data(web::JsonConfig::default().limit(4096))
            .wrap(Logger::default())
            .wrap(Compress::default())
            .wrap(RequestHandler::default())
            .configure(route::general_config)
            .service(
                web::scope("/v1")
                    .configure(route::auth::auth_config)
                    .configure(route::admin::admin_config)
                    .configure(route::case::test_case_config)
                    .configure(route::profile::profile_config)
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
