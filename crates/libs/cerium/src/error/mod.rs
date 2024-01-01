use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use sea_orm::DbErr;
use serde_json::{json, Error as SerdeJsonError};
use thirtyfour::error::WebDriverError;
use thiserror::Error;

// pub use cerium::{CeriumError as OtherCeriumError, CeriumResult, ErrorResponse};
pub type CeriumResult<T> = Result<T, CeriumError>;

pub mod cerium;
pub mod web;

/// Our app's top level error type.
#[derive(Error, Debug)]
pub enum CeriumError {
    /// Something went wrong when calling the user repo.
    #[error("Got A Database Error: {0}")]
    DataBaseError(#[from] DbErr),
    #[error("Error While Serializer: {0}")]
    SerializerError(#[from] SerdeJsonError),
    #[error("Webdriver error: {0}")]
    WebdriverError(#[from] WebDriverError),
}

impl IntoResponse for CeriumError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            CeriumError::DataBaseError(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            CeriumError::SerializerError(err) => {
                (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
            }
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
