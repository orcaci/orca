use std::fmt;
use std::fmt::{Display, Formatter};
use std::io::Error as BaseError;

use actix_web::{Error as ActixError, HttpResponse, ResponseError};
use http::StatusCode;
use jsonwebtoken::errors::Error;
use serde::{Deserialize, Serialize};
use thiserror::Error;

pub type OrcaResult = Result<HttpResponse, OrcaError>;

pub type InternalResult<T> = Result<T, OrcaError>;

#[derive(Clone)]
pub struct ErrorResponse {
    code: StatusCode,
    error: String,
    message: String,
}

#[derive(Serialize)]
struct Response {
    code: u16,
    error: String,
    message: String,
}

impl ErrorResponse {
    pub fn new(code: StatusCode, error: &str, message: String) -> Self {
        Self { code, error: error.to_string(), message }
    }
}

/// OrcaError - will have all the error raised from Orca system
#[derive(Error, Debug)]
pub enum OrcaError {
    /// Internal Error Core Error
    #[error("json error: {0}")]
    JsonError(#[from] serde_json::Error),
    #[error("io error: {0}")]
    IoError(#[from] std::io::Error),
    #[error("DB error: {0}")]
    DBError(#[from] sea_orm::DbErr),
    #[error("JWT error: {0}")]
    JWTError(#[from] Error),
    #[error("You are forbidden to access requested file.")]
    Forbidden,
    #[error("Header ({0}) is not available.")]
    HeaderNotFound(String),

    #[error("User Not found")]
    UserNotFound(i32),

    // #[error("Unknown Internal Error - {0}")]
    // Unknown(#[from] String)
}

impl OrcaError {
    pub fn decode(&self) -> ErrorResponse {
        match self {
            Self::HeaderNotFound(ref _a) => ErrorResponse::new(StatusCode::NOT_FOUND, "HeaderNotFound", self.to_string()),

            Self::JsonError(ref _a) => ErrorResponse::new(StatusCode::INTERNAL_SERVER_ERROR, "NotFound", self.to_string()),
            // Self::NotFound => ErrorResponse::new(StatusCode::OK, "NotFound", self.to_string()),
            Self::Forbidden => ErrorResponse::new(StatusCode::INTERNAL_SERVER_ERROR, "Unknown", self.to_string()),
            Self::IoError(ref _a) => ErrorResponse::new(StatusCode::INTERNAL_SERVER_ERROR, "Unknown", self.to_string()),
            Self::DBError(ref _a) => ErrorResponse::new(StatusCode::INTERNAL_SERVER_ERROR, "DBError", self.to_string()),

            Self::JWTError(ref _a) => ErrorResponse::new(StatusCode::INTERNAL_SERVER_ERROR, "JWTError", self.to_string()),

            Self::UserNotFound(ref _a) => ErrorResponse::new(StatusCode::NOT_FOUND, "UserNotFound", self.to_string()),
            _ => ErrorResponse::new(StatusCode::INTERNAL_SERVER_ERROR, "Unknown", self.to_string()),
        }
    }
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        f.write_fmt(format_args!(
            "An error occurred: \"{}\"",
            self.to_string()
        ))
    }
}

impl ResponseError for OrcaError {

    fn error_response(&self) -> HttpResponse {
        let response = self.decode();
        let _status_code = response.clone().code;
        let eresponse = Response{
            code: response.clone().code.as_u16(),
            error: response.error,
            message: response.message
        };
        HttpResponse::build(_status_code).json(eresponse)
    }
}
