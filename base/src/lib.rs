pub mod client;
pub mod config;
pub mod env;
pub mod middleware;
pub mod utils;
pub mod server;


use lazy_static::lazy_static;
pub use crate::config::key::Config as KeyConfig;

lazy_static! {
    pub static ref CONFIG: KeyConfig = KeyConfig::new().unwrap();
}