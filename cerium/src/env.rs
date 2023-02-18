
use config::{Config as CConfig, ConfigError, File};
use serde::Deserialize;
use std::env;

#[derive(Debug, Deserialize, Clone)]
#[allow(unused)]
pub struct Environment {
    pub debug: bool,
    pub connection: Connection,
}

#[derive(Debug, Deserialize, Clone)]
#[allow(unused)]
pub struct Connection {
    pub database: String,
    pub selenium: String,
}

impl Environment {
    pub fn new() -> Result<Self, ConfigError> {
        let run_mode = env::var("RUN_MODE").unwrap_or_else(|_| "development".into());
        let result_config = CConfig::builder()
            .add_source(File::with_name("../config/default"))
            .add_source(File::with_name(&format!("../config/{}", run_mode)).required(false))
            .build();
        let _new = result_config?;
        _new.try_deserialize()
    }
}
