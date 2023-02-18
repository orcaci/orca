use lazy_static::lazy_static;
use crate::config::Config;
use crate::env::Environment;

use async_once::AsyncOnce;

pub mod client;
pub mod config;
pub mod error;
pub mod server;
pub mod utils;
pub mod env;


lazy_static! {
    // AsyncOnce::new(async {
    //     Config::new().await
    // });
    pub static ref CONFIG: Config = Config::new().unwrap();
    pub static ref ENV: Environment = CONFIG.env.clone();
    // Environment::new().unwrap();
}