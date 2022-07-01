use actix_http::HttpMessage;
use actix_web::dev::ServiceRequest;

use crate::core::client::{CLIENT, Client, database};
use crate::core::client::database::Database;

// This struct represents state
#[derive(Debug, Copy, Clone, Default)]
pub struct RequestContext {
    db: Option<Database>
}

impl RequestContext {
    fn default() -> Self {
        Self {
            db: None
        }
    }
    pub(crate) fn set_request_value(mut req: ServiceRequest) -> ServiceRequest{
        let rc = Self::default();
        req.extensions_mut().insert(rc);
        req
    }
    pub fn database(mut self) -> Database {
        if self.db.is_none() {
            self.db = Some(CLIENT.lock().unwrap().clone().database());
        }
        self.db.unwrap()
    }
}

