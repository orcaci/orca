use std::fmt;
use std::fmt::{Display, Formatter};
use actix_web::Error;

use actix_web::http::StatusCode;

mod base;

pub use base::{OrcaResult, OrcaError};

//
// pub type OrcaResult<T> = Result<T, Error>;
//
// #[derive(Serialize)]
// struct ErrorResponse {
//     code: u16,
//     error: String,
//     message: String,
// }
//
// #[derive(Error, Debug)]
// pub enum OrcaError {
//     #[error("json error: {0}")]
//     Json(#[from] serde_json::Error),
//     #[error("io error: {0}")]
//     IoError(#[from] std::io::Error),
//     #[error("Requested file was not found")]
//     NotFound,
//     #[error("You are forbidden to access requested file.")]
//     Forbidden,
//     #[error("Unknown Internal Error")]
//     Unknown
// }
//
// impl OrcaError {
//     pub fn name(&self) -> String {
//         match self {
//             Self::NotFound => "NotFound".to_string(),
//             Self::Forbidden => "Forbidden".to_string(),
//             Self::Unknown => "Unknown".to_string(),
//         }
//     }
// }
// impl ResponseError for OrcaError {
//     fn status_code(&self) -> StatusCode {
//         match *self {
//             Self::NotFound  => StatusCode::NOT_FOUND,
//             Self::Forbidden => StatusCode::FORBIDDEN,
//             Self::Unknown => StatusCode::INTERNAL_SERVER_ERROR,
//         }
//     }
//
//     fn error_response(&self) -> HttpResponse {
//         let status_code = self.status_code();
//         let error_response = ErrorResponse {
//             code: status_code.as_u16(),
//             message: self.to_string(),
//             error: self.name(),
//         };
//         HttpResponse::build(status_code).json(error_response)
//     }
// }
//
