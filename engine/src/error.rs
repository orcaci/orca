use std::fmt;
use std::fmt::{Formatter};

use serde::{Serialize};

use thiserror::Error;

pub type EngineResult<T> = Result<T, EngineError>;

#[derive(Clone)]
pub struct ErrorResponse {
    code: String,
    error: String,
    message: String,
}

impl ErrorResponse {
    pub fn new(error: &str, message: String) -> Self {
        Self { code: "".to_string(), error: error.to_string(), message }
    }
}

/// EngineError - will have all the error raised from Cerium system
#[derive(Error, Debug)]
pub enum EngineError {
    #[error("You are forbidden to access requested file.")]
    Forbidden,
    #[error("Missing Parameter: field - {0}, {1}")]
    MissingParameter(String, String),
    #[error("Webdriver error: {0}")]
    WebdriverError(#[from] thirtyfour::error::WebDriverError),
    #[error("Database error: {0}")]
    DatabaseError(#[from] sea_orm::DbErr),
    
}

impl EngineError {
    pub fn decode(&self) -> ErrorResponse {
        match self {
            Self::Forbidden => ErrorResponse::new("Unknown", self.to_string()),
            Self::MissingParameter(ref e, ref b) => ErrorResponse::new("MissingParameter", self.to_string()),
            Self::WebdriverError(ref e) => ErrorResponse::new("WebdriverError", self.to_string()),
            Self::DatabaseError(ref e) => ErrorResponse::new("DatabaseError", self.to_string()),
            _ => ErrorResponse::new("Unknown", self.to_string()),
        }
    }
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        f.write_fmt(format_args!(
            "An error occurred: \"{}\"",
            self.to_string()
        ))
    }
}