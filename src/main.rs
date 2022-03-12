#![allow(dead_code)]
#![allow(unused_variables)]

use actix_web::middleware::Logger;
use actix_web::middleware::errhandlers::{ErrorHandlerResponse, ErrorHandlers};
use actix_web::{dev, http, web, App, HttpResponse, HttpServer, Result};

mod core;
mod route;
mod server;

fn add_error_header<B>(mut res: dev::ServiceResponse<B>) -> Result<ErrorHandlerResponse<B>> {
    res.response_mut().headers_mut().insert(
        http::header::CONTENT_TYPE,
        http::HeaderValue::from_static("Error"),
    );
    Ok(ErrorHandlerResponse::Response(res))
}

/// main - This is application server that will accessible with API
#[actix_web::main]
async fn main() -> std::io::Result<()> {

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            // .wrap(Logger::new("%a %{User-Agent}i"))
            // .wrap(ErrorHandlers::new().handler(
            //     http::StatusCode::INTERNAL_SERVER_ERROR,
            //     add_error_header,
            // ))
            .service(route::register())
            // .service(route::admin::register())
            // .service(route::ws::register())
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
