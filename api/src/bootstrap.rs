//! migration module will controller the Migration of application
//! automatically on beginning of application startup
//!

use std::io::Write;

use actix_web::{App, HttpServer, web};
use actix_web::middleware::{Compress, Logger};
use chrono::Local;
use dotenv::dotenv;
use env_logger::Builder;
use env_logger::fmt::Color;
use log::LevelFilter;
use sea_orm::DbErr;

use migration::MigratorTrait;

use crate::route;
use crate::route::ws::ws_init;
use crate::server::middleware::request::RequestHandler;
use crate::utils::config::CONFIG;

/// init_logger - function will initialize log Handler for the application
pub(crate) fn init_logger() {
    dotenv().ok();
    Builder::new()
        .format(|buf, record| {
            let mut timestamp_style = buf.style();
            timestamp_style.set_color(Color::Magenta);

            let mut level_style = buf.style();
            level_style.set_color(Color::Red);
            writeln!(buf,
                "[{} {}] {} >>> {}",
                timestamp_style.value(Local::now().format("%d-%m-%Y %H:%M:%S")),
                level_style.value(record.level()),
                record.module_path_static().unwrap_or(""),
                record.args()
            )
        })
        .filter_level(LevelFilter::Debug)
        .init();
    // env_logger::init();
}

pub(crate) async fn run_migration() -> Result<(), DbErr> {
    migration::Migrator::up(&CONFIG.get().await.db_client, None).await?;
    Ok(())
}

/// run_app_server - will kick start the Application server
/// that will navigate all the rest request for Application
pub(crate) async fn run_app_server() -> std::io::Result<()> {
    // let mut builder = SslAcceptor::mozilla_intermediate(SslMethod::tls()).unwrap();
    // builder
    //     .set_private_key_file("key.pem", SslFiletype::PEM)
    //     .unwrap();
    // builder.set_certificate_chain_file("cert.pem").unwrap();
    HttpServer::new(move || {
        App::new()
            .app_data(web::JsonConfig::default().limit(4096))
            .wrap(Logger::default())
            .wrap(Compress::default())
            .wrap(RequestHandler::default())
            .configure(route::general_config)
            .service(web::resource("/ws").route(web::get().to(ws_init)))
            .service(
                web::scope("/api/v1")
                    .configure(route::app::app_config)
            )
    })
    .workers(5)
    .bind("127.0.0.1:10000")?
    .run()
    .await
}
