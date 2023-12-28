use axum::http::StatusCode;
use axum::Json;
use axum::response::{IntoResponse, Response};
use sea_orm::DbErr;
use serde_json::{Error as SerdeJsonError, json};

pub use cerium::{CeriumError as OtherCeriumError, CeriumResult, ErrorResponse};

pub mod web;
pub mod cerium;

// pub type OrcaResult = InternalResult<impl IntoResponse>;

pub type InternalResult<T> = Result<T, CeriumError>;

/// Our app's top level error type.
pub enum CeriumError {
    /// Something went wrong when calling the user repo.
    DataBaseError(DbErr),
    SerializerError(SerdeJsonError)
}

/// This makes it possible to use `?` to automatically convert a `DbErr`
/// into an `CeriumError`.
impl From<DbErr> for CeriumError {
    fn from(inner: DbErr) -> Self {
        CeriumError::DataBaseError(inner)
    }
}

/// This makes it possible to use `?` to automatically convert a `DbErr`
/// into an `CeriumError`.
impl From<SerdeJsonError> for CeriumError {
    fn from(inner: SerdeJsonError) -> Self {
        CeriumError::SerializerError(inner)
    }
}

impl IntoResponse for CeriumError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            CeriumError::DataBaseError(err) =>{
                (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
            }
            CeriumError::SerializerError(err) => {
                (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
            }
            _ => (StatusCode::INTERNAL_SERVER_ERROR, "Internal Error Not Specify".to_string())
        };

        let body = Json(json!({
            "error": error_message,
        }));

        (status, body).into_response()
    }
}