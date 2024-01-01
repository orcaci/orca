use sea_orm::DatabaseConnection;

use crate::env::Environment;

#[derive(Debug)]
#[allow(unused)]
pub struct Config {
    pub env: Environment,
    pub db: Option<DatabaseConnection>,
}

impl Config {
    pub fn new() -> Self {
        let env = Environment::default();
        let config = Config { env, db: None };
        config
    }
}
