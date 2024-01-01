extern crate cerium;

use log::info;

use crate::bootstrap::{init_logger, run_app_server, run_migration};

pub(crate) mod bootstrap;
pub(crate) mod utils;
pub(crate) mod route;
pub(crate) mod server;
pub(crate) mod error;


#[actix_web::main]
async fn main() -> std::io::Result<()> {

    init_logger();
    info!("!!! Starting Orca Application v2 !!!");
    run_migration().await.expect("Failed to Migrating the Latest Version");
    info!("Exiting Migrating DDL Command ");
    info!("Starting Application Server ");
    run_app_server().await?;
    Ok(())
}
