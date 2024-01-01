use std::env;
use std::sync::Arc;

use sea_orm::{DatabaseConnection, DbErr};
use tracing::Level;

use cerium::client::Client;
use cerium::env::Environment;
use cerium::server::App;
use migration::MigratorTrait;

use crate::route::handle_router;
use crate::server::middleware::OrcaLayer;

pub(crate) mod error;
pub(crate) mod route;
pub(crate) mod server;
pub(crate) mod service;
pub(crate) mod utils;

pub(crate) async fn run_migration(db: &DatabaseConnection) -> Result<(), DbErr> {
    migration::Migrator::up(db, None)
        .await
        .expect("TODO: panic message");
    Ok(())
}
pub(crate) async fn get_config() -> Client {
    let env  = Environment::default();
    Client::new(
        Some(env.database_uri),
        Some(env.redis_uri),
    ).await
}

#[tokio::main]
async fn main() {
    let cli = get_config().await;
    let mut app = App::new("OrcaWeb", cli.clone());
    app.set_logger(Level::DEBUG);
    app.set_port(8080);

    run_migration(cli.db()).await.expect("TODO: panic message");
    let routers = handle_router().layer(OrcaLayer {
        db: Arc::new(cli.db.clone()),
    });
    app.set_router(routers);
    app.run().await;
}
