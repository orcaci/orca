use std::env;

use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct Environment {
    pub debug: bool,
    pub database_uri: String,
    pub redis_uri: String,
    pub selenium_uri: String,
    pub encryption_salt: String,
    pub minio_access_key: String,
    pub minio_access_secret: String,
}

impl Environment {
    pub fn default() -> Self {
        Environment {
            debug: env::var("DEBUG")
                .unwrap_or("false".to_string())
                .parse()
                .unwrap(),
            database_uri: env::var("DATABASE_URI").unwrap_or("".to_string()),
            redis_uri: env::var("REDIS_URI").unwrap_or("".to_string()),
            selenium_uri: env::var("SELENIUM_URI").unwrap_or("".to_string()),
            encryption_salt: env::var("ENCRYPTION_SALT").unwrap_or("".to_string()),
            minio_access_key: env::var("MINIO_ACCESS_KEY").unwrap_or("".to_string()),
            minio_access_secret: env::var("MINIO_ACCESS_SECRET").unwrap_or("".to_string()),
        }
    }
}
