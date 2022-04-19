use std::ops::Deref;
use std::sync::MutexGuard;
use actix_http::HttpMessage;
use actix_web::dev::ServiceRequest;
use base::client::{CLIENT, Client, database};
use base::client::database::Database;

// This struct represents state
#[derive(Debug, Copy, Clone, Default)]
pub struct RequestContext {
}

impl RequestContext {
    fn default() -> Self {
        Self {
        }
    }
    pub(crate) fn set_request_value(mut req: ServiceRequest) -> ServiceRequest{
        let rc = Self::default();
        req.extensions_mut().insert(rc);
        req
    }
    pub fn database(self) -> Database {
        CLIENT.lock().unwrap().clone().database()
    }
}

