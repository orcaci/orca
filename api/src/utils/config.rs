//! config module will have all configuration
//!

use async_once::AsyncOnce;
use lazy_static::lazy_static;
use sea_orm::{Database, DatabaseConnection, DbErr};

lazy_static! {
    pub(crate) static ref CONFIG: AsyncOnce<Config> = AsyncOnce::new(async {
        Config::new().await
    });
}

pub(crate) enum Environment {
    Dev,
    Production
}


pub(crate) struct Config {
    pub env: Environment,
    pub db_client: DatabaseConnection
}

impl Config {
    pub async fn new() -> Self {
        Config{
            env: Environment::Dev,
            db_client: Self::db_client(None).await,
        }
    }

    pub fn db(&self) -> &DatabaseConnection {
        &self.db_client
    }

    /// db_uri will give the default uri if there is not config setup
    async fn db_client(mut uri: Option<String>) -> DatabaseConnection {
        if uri.is_none(){
            uri = Some("postgres://root:root@localhost:5432/orca".to_string())
        }
        Database::connect(uri.unwrap()).await.expect("Error unable to connect DB")
    }
}