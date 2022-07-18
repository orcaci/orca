use serde::Deserialize;
use config::{Config as CConfig, ConfigError, File};
use std::env;



#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct Config {
    debug: bool,
    pub database: Database,
    pub selinum: Selinum
}

#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct Database {
    pub url: String,
}

#[derive(Debug, Deserialize)]
pub struct Selinum {
    pub hub: String,
}


impl Config {
    pub fn new() -> Result<Self, ConfigError> {
        let run_mode = env::var("RUN_MODE").unwrap_or_else(|_| "development".into());
        let result_config = CConfig::builder()
            .add_source(File::with_name("config/default"))
            .add_source(File::with_name(&format!("config/{}", run_mode)).required(false))
            .build();
        let _new = result_config.unwrap();
        _new.try_deserialize()
    }
}