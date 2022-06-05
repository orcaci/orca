use std::error::Error;
use std::fmt;
use std::fmt::{Display, Formatter};

use actix_web::http::StatusCode;

#[derive(Debug)]
struct OrcaBaseError {
    code: String,
    request_id: String,
    message: String
}

impl Display for OrcaBaseError {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(f, "OrcaBaseError is here!")
    }
}

// /// base internal server error
// #[allow(non_snake_case)]
// pub fn BaseInternalServerError<T>(err: T) -> Error
// where
//     T: fmt::Debug + fmt::Display + 'static,
// {
//     InternalError::new(err, StatusCode::INTERNAL_SERVER_ERROR).into()
// }
//
// /// Database connection issue
// /// *PAYMENT_REQUIRED* response.
// #[allow(non_snake_case)]
// pub fn ErrorDBConnectionIssue<T>(err: T) -> Error
// where
//     T: fmt::Debug + fmt::Display + 'static,
// {
//     BaseInternalServerError(err)
// }