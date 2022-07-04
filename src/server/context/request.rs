use std::future::Future;
use actix::prelude::*;
use std::pin::Pin;
use std::process::Output;
use actix_http::{header, HttpMessage, Payload};
use actix_web::dev::ServiceRequest;
use actix_web::{FromRequest, HttpRequest};
use http::header::HeaderName;
use http::HeaderValue;
use log::error;

use crate::core::client::{CLIENT, Client, database};
use crate::core::client::database::Database;
use crate::core::error::OrcaError;

// This struct represents state
#[derive(Debug, Clone, Default)]
pub struct RequestContext {
    db: Option<Database>,
    auth_token: Option<String>,
    request_id: Option<String>
}

impl FromRequest for RequestContext {
    type Error = OrcaError;
    type Future = Pin<Box<dyn Future<Output=Result<RequestContext, Self::Error>>>>;
    fn from_request(_req: &HttpRequest, _: &mut Payload) -> Self::Future {
        // let auth_token = req.headers().get(header::AUTHORIZATION).map(|h| h.to_str().unwrap().to_string());
        let req = _req.clone();
        let future = async move {
            let rc = req.extensions_mut().get_mut::<RequestContext>().map(|c| c.clone()).unwrap();
            Ok(rc)
        };
        Box::pin(future)
    }
}

/// RequestContext - will have all the dependency for the request
/// this will get created on each request and Will Construct required object in lazy
impl RequestContext {
    /// Create a new RequestContext
    pub fn new(request: &ServiceRequest) -> Self {
        let mut _self = Self { db: None, request_id: None, auth_token: None };
        _self.validate_request(request).expect("TODO: panic message");
        _self
    }

    pub fn get_header_value(&self, request: &ServiceRequest, header_name: &HeaderName) -> Result<String, OrcaError> {
        let header_value = request.headers().get(header_name).ok_or(OrcaError::HeaderNotFound(header_name.to_string()))?;
        Ok(header_value.to_str().unwrap().to_string())
    }

    fn authorize_request(request: &ServiceRequest) -> InternalResult<()> {
        let auth_token = request.headers().get(header::AUTHORIZATION).ok_or(OrcaError::HeaderNotFound(header::AUTHORIZATION.to_string()))?;
        let auth_token = auth_token.to_str().unwrap().to_string();
        Ok(())
    }

    pub fn validate_request(&self, request: &ServiceRequest) -> Result<(), String> {
        let auth_token = self.get_header_value(request,&header::AUTHORIZATION);
        let auth = request.headers().get(header::AUTHORIZATION).ok_or(String::from("No Authorization header found"))?;
        let auth_str = auth.to_str().map_err(|_| String::from("Authorization header is not a valid string"))?;
        let l_auth_str = auth_str.split_whitespace().collect::<Vec<&str>>();
        let l_auth_str_len = l_auth_str.last().ok_or(String::from("Authorization header is not a valid string"))?;
        log::info!("Authorization header: {}", l_auth_str_len);
        Ok(())
    }

    pub(crate) fn set_request_value(mut req: ServiceRequest) -> ServiceRequest{
        let rc = Self::default();
        req.extensions_mut().insert(rc);
        req
    }
    pub fn database(&mut self) -> Database {
        if self.db.is_none() {
            self.db = Some(CLIENT.lock().unwrap().clone().database());
        }
        self.db.clone().unwrap()
    }
}

