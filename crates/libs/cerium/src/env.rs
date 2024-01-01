use std::env;

use config::{Config as CConfig, File};
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
#[allow(unused)]
pub struct Environment {
    pub debug: bool,
    pub database_uri: String,
    pub redis_uri: String,
    pub selenium_uri: String,
    pub encryption_salt: String
}


impl Environment {
    pub fn default() -> Self {
        Environment {
            debug: env::var("DEBUG").unwrap_or("false".to_string()).parse().unwrap(),
            database_uri: env::var("DATABASE_URI").unwrap_or("".to_string()),
            redis_uri: env::var("REDIS_URI").unwrap_or("".to_string()),
            selenium_uri: env::var("SELENIUM_URI").unwrap_or("".to_string()),
            encryption_salt: env::var("ENCRYPTION_SALT").unwrap_or("".to_string()),
        }
    }
}
