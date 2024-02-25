use std::time::Duration;

use crate::client::storage::s3::S3Client;
use sea_orm::{ConnectOptions, Database, DatabaseConnection};
use crate::env::Environment;

pub mod cache;
pub mod db;
pub mod driver;
pub mod storage;

#[derive(Debug, Clone)]
pub struct Client {
    pub env: Environment,
    pub db: DatabaseConnection,
    pub storage_cli: S3Client,
}

impl Client {
    pub async fn new(environment: Option<Environment>,) -> Self {
        let _env = environment.unwrap_or(Environment::default());
        let storage_cli = Self::storage_client(&_env).await;
        Client {
            db: Self::db_client(Some(_env.database_uri.clone())).await,
            env: _env,
            storage_cli,
        }
    }
    async fn storage_client(environment: &Environment) -> S3Client {
        return S3Client::new(
            &*environment.storage_access_key.clone(),
            &*environment.storage_access_secret.clone(),
            &*environment.storage_base_url.clone()
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
