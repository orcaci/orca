use lazy_static::lazy_static;

pub use crate::core::config::key::Config as KeyConfig;

pub mod client;
pub mod config;
pub mod constant;
pub mod env;
pub mod middleware;
pub mod utils;
pub mod server;
pub mod error;


lazy_static! {
    pub static ref CONFIG: KeyConfig = KeyConfig::new().unwrap();
}