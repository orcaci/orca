extern crate base;

use actix_web::{App, http, HttpServer, web};
use actix_web::middleware::{Compress, ErrorHandlers, Logger};
use base::middleware::{error, request::RequestHandler};
use base::utils::logger;
use log::{debug, error, info, Level, log_enabled, logger};

mod constant;
mod core;
mod route;
mod server;

/// main - This is application server that will accessible with API
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    logger::init().expect("TODO: panic message");
    // use migration::{Migrator, MigratorTrait};
    // let request_ctx = RequestContext::default();
    // let db = request_ctx.database();
    // Migrator::up(&db.conn, None).await;
    HttpServer::new(move|| {
        App::new()
            // .app_data(web::Data::new(rc.clone()))
            .wrap(Logger::default())
            .wrap(Compress::default())
            // .wrap(ErrorHandlers::new().handler(
            //     http::StatusCode::INTERNAL_SERVER_ERROR,
            //     error::add_error_header,
            // ))
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
