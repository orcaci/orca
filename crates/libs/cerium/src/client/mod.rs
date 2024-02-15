use std::time::Duration;

use crate::client::storage::s3::S3Client;
use sea_orm::{ConnectOptions, Database, DatabaseConnection};

pub mod cache;
pub mod db;
pub mod driver;
pub mod storage;

#[derive(Debug, Clone)]
pub struct Client {
    pub db: DatabaseConnection,
    pub storage_cli: S3Client,
}

impl Client {
    pub async fn new(db_uri: Option<String>, _redis_uri: Option<String>) -> Self {
        Client {
            db: Self::db_client(db_uri).await,
            storage_cli: Self::storage_client().await,
        }
    }
    async fn storage_client() -> S3Client {
        return S3Client::new(
            &std::env::var("STORAGE_ACCESS_KEY").expect("STORAGE_ACCESS_KEY must be set."),
            &std::env::var("STORAGE_ACCESS_SECRET").expect("STORAGE_ACCESS_SECRET must be set."),
            &std::env::var("STORAGE_BASE_URL").expect("STORAGE_BASE_URL must be set."),
        )
        .expect("Error While create Storage Client");
    }

    pub fn db(&self) -> &DatabaseConnection {
        &self.db
    }

    /// db_uri will give the default uri if there is not config setup
    async fn db_client(mut uri: Option<String>) -> DatabaseConnection {
        if uri.is_none() {
            uri = Some(std::env::var("DATABASE_URI").expect("DATABASE_URL must be set."));
        }
        let mut opt = ConnectOptions::new(uri.unwrap());
        opt.max_connections(10)
            .min_connections(5)
            .connect_timeout(Duration::from_secs(8))
            .acquire_timeout(Duration::from_secs(8))
            .idle_timeout(Duration::from_secs(8))
            .max_lifetime(Duration::from_secs(8))
            .sqlx_logging(true);
        Database::connect(opt)
            .await
            .expect("Error unable to connect DB")
        // Database::connect(uri.unwrap()).await.expect("Error unable to connect DB")
    }
}
