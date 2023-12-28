use sea_orm::DbErr;
use serde_json::Error as SerdeJsonError;
use thirtyfour::error::WebDriverError;
use thiserror::Error;

pub type EngineResult<T> = Result<T, EngineError>;


/// EngineError - will have all the error raised from Cerium system
#[derive(Error, Debug)]
pub enum EngineError {
    #[error("You are forbidden to access requested file.")]
    Forbidden,
    #[error("Missing Parameter: field - {0}, {1}")]
    MissingParameter(String, String),
    #[error("Webdriver error: {0}")]
    WebdriverError(#[from] WebDriverError),
    #[error("Database error: {0}")]
    DatabaseError(#[from] DbErr),
    #[error("Json Serialization error: {0}")]
    SerializerError(#[from] SerdeJsonError)
}

