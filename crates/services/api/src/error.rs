use std::backtrace::Backtrace;

use axum::http::StatusCode;
use axum::Json;
use axum::response::{IntoResponse, Response};
use sea_orm::DbErr;
use serde_json::{Error as SerdeJsonError, json};
use thiserror::Error;
use tracing::error;

use cerium::error::CeriumError;
use engine::error::EngineError;

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
    InvalidUsername(String),
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
        error!("Error: {}", Backtrace::force_capture());
        let body = Json(json!({
            "error": error_message,
        }));

        (status, body).into_response()
    }
}
