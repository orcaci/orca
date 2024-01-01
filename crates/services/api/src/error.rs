use axum::http::StatusCode;
use axum::Json;
use axum::response::{IntoResponse, Response};
use sea_orm::DbErr;
use serde_json::{Error as SerdeJsonError, json};
use thiserror::Error;

use crate::error::OrcaError::RepoError;

pub type InternalResult<T> = Result<T, OrcaError>;

/// Errors that can happen when using the user repo.
#[derive(Error, Debug)]
pub enum OrcaRepoError {
    #[error("Item Not Found: {0}")]
    NotFound(String),
    #[error("{0} Not Found: {1}")]
    ModelNotFound(String, String),
    #[error("Invalid UserName: {0}")]
    InvalidUsername(i32),
}

/// Our app's top level error type.
pub enum OrcaError {
    /// Something went wrong when calling the user repo.
    DataBaseError(DbErr),
    RepoError(OrcaRepoError),
    SerializerError(SerdeJsonError),
}

/// This makes it possible to use `?` to automatically convert a `DbErr`
/// into an `OrcaError`.
impl From<OrcaRepoError> for OrcaError {
    fn from(inner: OrcaRepoError) -> Self {
        OrcaError::RepoError(inner)
    }
}

/// This makes it possible to use `?` to automatically convert a `DbErr`
/// into an `OrcaError`.
impl From<DbErr> for OrcaError {
    fn from(inner: DbErr) -> Self {
        OrcaError::DataBaseError(inner)
    }
}

/// This makes it possible to use `?` to automatically convert a `DbErr`
/// into an `OrcaError`.
impl From<SerdeJsonError> for OrcaError {
    fn from(inner: SerdeJsonError) -> Self {
        OrcaError::SerializerError(inner)
    }
}

impl IntoResponse for OrcaError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            OrcaError::DataBaseError(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            OrcaError::SerializerError(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            RepoError(err) => (StatusCode::NOT_FOUND, err.to_string()),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal Error Not Specify".to_string(),
            ),
        };

        let body = Json(json!({
            "error": error_message,
        }));

        (status, body).into_response()
    }
}
