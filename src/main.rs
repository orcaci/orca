use actix_web::{App, HttpServer};

mod route;

/// main - This is application server that will accessible with API
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(route::register())
            .service(route::admin::register())
            .service(route::ws::register())
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}