use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use cerium::error::CeriumError;
use engine::error::EngineError;
use sea_orm::DbErr;
use serde_json::{json, Error as SerdeJsonError};
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
#[derive(Error, Debug)]
pub enum OrcaError {
    /// Something went wrong when calling the user repo.

    #[error("DbErr error: {0}")]
    DataBaseError(#[from] DbErr),

    #[error("OrcaRepoError error: {0}")]
    RepoError(#[from] OrcaRepoError),

    #[error("SerializerError error: {0}")]
    SerializerError(#[from] SerdeJsonError),

    #[error("EngineError error: {0}")]
    EngineError(#[from] EngineError),

    #[error("CeriumError error: {0}")]
    CeriumError(#[from] CeriumError),
}

// /// This makes it possible to use `?` to automatically convert a `DbErr`
// /// into an `OrcaError`.
// impl From<OrcaRepoError> for OrcaError {
//     fn from(inner: OrcaRepoError) -> Self {
//         OrcaError::RepoError(inner)
//     }
// }
//
// /// This makes it possible to use `?` to automatically convert a `DbErr`
// /// into an `OrcaError`.
// impl From<DbErr> for OrcaError {
//     fn from(inner: DbErr) -> Self {
//         OrcaError::DataBaseError(inner)
//     }
// }
//
// /// This makes it possible to use `?` to automatically convert a `EngineError`
// /// into an `OrcaError`.
// impl From<EngineError> for OrcaError {
//     fn from(inner: EngineError) -> Self {
//         OrcaError::EngineError(inner)
//     }
// }
//
// /// This makes it possible to use `?` to automatically convert a `CeriumError`
// /// into an `OrcaError`.
// impl From<CeriumError> for OrcaError {
//     fn from(inner: CeriumError) -> Self {
//         OrcaError::CeriumError(inner)
//     }
// }

// /// This makes it possible to use `?` to automatically convert a `DbErr`
// /// into an `OrcaError`.
// impl From<SerdeJsonError> for OrcaError {
//     fn from(inner: SerdeJsonError) -> Self {
//         OrcaError::SerializerError(inner)
//     }
// }

impl IntoResponse for OrcaError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            OrcaError::DataBaseError(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            OrcaError::SerializerError(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            OrcaError::CeriumError(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            OrcaError::EngineError(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
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
