use std::time::Duration;

use sea_orm::{ConnectOptions, Database, DatabaseConnection};

pub mod cache;
pub mod db;


#[derive(Debug, Clone)]
pub struct Client {
    pub db: DatabaseConnection
}

impl Client {
    pub async fn new(db_uri: Option<String>, redis_uri: Option<String>) -> Self {
        Client{
            db: Self::db_client(db_uri).await,
        }
    }

    pub fn db(&self) -> &DatabaseConnection {
        &self.db
    }

    /// db_uri will give the default uri if there is not config setup
    async fn db_client(mut uri: Option<String>) -> DatabaseConnection {
        if uri.is_none(){
            uri = Some(std::env::var("DATABASE_URL").expect("DATABASE_URL must be set."));

        }
        let mut opt = ConnectOptions::new(uri.unwrap());
        opt.max_connections(10)
            .min_connections(5)
            .connect_timeout(Duration::from_secs(8))
            .acquire_timeout(Duration::from_secs(8))
            .idle_timeout(Duration::from_secs(8))
            .max_lifetime(Duration::from_secs(8))
            .sqlx_logging(true)
            .sqlx_logging_level(log::LevelFilter::Info);
        Database::connect(opt).await.expect("Error unable to connect DB")
        // Database::connect(uri.unwrap()).await.expect("Error unable to connect DB")
    }
}