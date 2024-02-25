use std::env;
use axum::http::HeaderValue;

#[derive(Debug, Clone)]
pub struct Environment {
    pub debug: bool,
    pub database_uri: String,
    pub redis_uri: String,
    pub selenium_uri: String,
    pub encryption_salt: String,
    pub storage_access_key: String,
    pub storage_access_secret: String,
    pub storage_base_url: String,
    pub cors_allowed_origin: Vec<HeaderValue>
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
            cors_allowed_origin: env::var("ALLOWED_ORIGINS").unwrap_or("".to_string()).split(',')
                .map(|origin| origin.parse::<HeaderValue>().unwrap()).collect(),
            storage_access_key: env::var("STORAGE_ACCESS_KEY").unwrap_or("".to_string()),
            storage_access_secret: env::var("STORAGE_ACCESS_SECRET").unwrap_or("".to_string()),
            storage_base_url: env::var("STORAGE_BASE_URL").unwrap_or("".to_string()),
        }
    }
}
