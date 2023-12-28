use std::sync::Arc;

use sea_orm::{DatabaseConnection, DbErr};
use tracing::Level;

use cerium::client::Client;
use cerium::server::App;
use migration::MigratorTrait;

use crate::server::middleware::OrcaLayer;
use crate::route::handle_router;

pub(crate) mod route;
pub(crate) mod error;
pub(crate) mod service;
pub(crate) mod server;
pub(crate) mod utils;


pub(crate) async fn run_migration(db: &DatabaseConnection) -> Result<(), DbErr> {
    migration::Migrator::up(db, None).await.expect("TODO: panic message");
    Ok(())
}


#[tokio::main]
async fn main() {
    let cli = Client::new(Some("postgres://root:root@localhost:5432/orca".to_string()), None).await;
    let mut app = App::new("OrcaWeb", cli.clone());
    app.set_logger(Level::DEBUG);
    app.set_port(8080);

    run_migration(cli.db()).await.expect("TODO: panic message");
    let routers = handle_router().layer(OrcaLayer { db: Arc::new(cli.db.clone()) });
    app.set_router(routers);
    app.run().await;
}
