use std::fmt;
use std::fmt::{Display, Formatter};
use std::io::Error as BaseError;

use jsonwebtoken::errors::Error;
use serde::{Deserialize, Serialize};
use surrealdb_rs::{Error as DatabaseError};

use thiserror::Error;

pub type CeriumResult<T> = Result<T, CeriumError>;

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

/// CeriumError - will have all the error raised from Cerium system
#[derive(Error, Debug)]
pub enum CeriumError {
    /// Internal Error Core Error
    #[error("json error: {0}")]
    JsonError(#[from] serde_json::Error),
    #[error("JWT error: {0}")]
    JWTError(#[from] Error),
    #[error("Database Client Error: {0}")]
    DatabaseClientError(#[from] DatabaseError),
    #[error("User is not Unauthenticated or not Authorized")]
    UnAuthenticated,
    #[error("You are forbidden to access requested file.")]
    Forbidden,
}

impl CeriumError {
    pub fn decode(&self) -> ErrorResponse {
        match self {
            Self::JsonError(ref _a) => ErrorResponse::new("NotFound", self.to_string()),
            Self::UnAuthenticated => ErrorResponse::new("UnAuthorized", self.to_string()),
            Self::Forbidden => ErrorResponse::new("Unknown", self.to_string()),
            Self::JWTError(ref _a) => ErrorResponse::new("JWTError", self.to_string()),
            Self::DatabaseClientError(ref _a) => ErrorResponse::new("DatabaseError",
                                                                    self.to_string()),
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