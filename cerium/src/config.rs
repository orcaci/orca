

use config::{ Config as CConfig, ConfigError };
use serde::Deserialize;
use std::env;
use std::fs::File;

#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct Config {
    debug: bool,
    pub database: Database,
    pub selenium: Selenium
}

#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct Database {
    pub url: String,
}

#[derive(Debug, Deserialize)]
pub struct Selenium {
    pub hub: String,
}

impl Config {
    pub fn new() -> Result<Self, ConfigError> {
        let run_mode = env::var("RUN_MODE").unwrap_or_else(|_| "development".into());
        let result_config = CConfig::builder()
            // .add_source(File::with_name("config/default"))
            // .add_source(File::with_name(&format!("config/{}", run_mode)).required(false))
            .build();
        let _new = result_config.unwrap();
        _new.try_deserialize()
    }
}
