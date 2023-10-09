use std::time::Duration;

use sea_orm::{ConnectOptions, Database, DatabaseConnection};

use crate::env::Environment;

#[derive(Debug)]
#[allow(unused)]
pub struct Config {
    pub env: Environment,
    pub db: Option<DatabaseConnection>
}

impl Config {
    pub fn new() -> Self {
        let env = Environment::new();
        let config = Config{ env, db: None };
        config
    }

    /// database - will give connection SeaOrm Database
    pub async fn database(&mut self) -> DatabaseConnection {
        if self.db.is_none() {
            let uri = self.env.clone().connection.database;
            log::info!("Got connection String {}", uri.clone());
            let mut opt = ConnectOptions::new(self.env.clone().connection.database);
            opt.max_connections(100)
                .min_connections(5)
                .connect_timeout(Duration::from_secs(8))
                .acquire_timeout(Duration::from_secs(8))
                .idle_timeout(Duration::from_secs(8))
                .max_lifetime(Duration::from_secs(8))
                .sqlx_logging(true)
                .sqlx_logging_level(log::LevelFilter::Info)
                .set_schema_search_path("orca".into());

            self.db = Some(Database::connect(opt).await.expect("Error on connection"))
        }
        self.db.clone().unwrap()
    }
}
