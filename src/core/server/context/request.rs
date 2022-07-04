use std::ops::Deref;
use std::sync::MutexGuard;
use std::time::{SystemTime, SystemTimeError};

use actix_http::HttpMessage;
use actix_web::dev::ServiceRequest;
use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use log::info;
use sea_orm::{DatabaseTransaction, DbErr, TransactionTrait};

use crate::core::client::{CLIENT, Client, database};
use crate::core::client::database::Database;
use crate::core::utils::uuid::request_uuid;

/// RequestContext - will have all the dependency for the request
/// this will get created on each request and Will Construct required object in lazy
#[derive(Debug)]
pub struct RequestContext {
    request_id: String,
    start_time: SystemTime,
    tx: Option<DatabaseTransaction>
}

impl RequestContext {
    pub fn new() -> Self {
        Self {
            request_id: request_uuid(),
            start_time: SystemTime::now(),
            tx: None
        }
    }
    pub fn get_request_id(&self) -> String {
        self.request_id.clone()
    }

    pub fn end_request(&self) -> Result<(), SystemTimeError> {
        let end_time = SystemTime::now();
        let start_time = self.start_time.elapsed()?.as_secs();
        info!("Completed Request {:} after - {:?}", self.get_request_id(), self.start_time.elapsed());
        Ok(())
    }

    pub fn set_request_value(mut req: ServiceRequest) -> ServiceRequest{
        let rc = Self::new();
        req.extensions_mut().insert(rc);
        req
    }
    pub fn database(&self) -> Database {
        CLIENT.lock().unwrap().clone().database()
    }

    /// Begin transaction for any request in Orca
    pub async fn begin_tx(&mut self) ->  Result<&DatabaseTransaction, DbErr> {
        self.tx = Some(self.database().conn.begin().await?);
        Ok(self.tx.as_ref().unwrap())
    }
    pub fn commit_tx(self) {
        if self.tx.is_some(){
            let result = self.tx.unwrap().commit();
        } else {
            log::warn!("There is no transaction started -> Skipping commit")
        }
    }

    pub fn rollback(self){
        if self.tx.is_some(){
            let result = self.tx.unwrap().rollback();
        } else {
            log::warn!("There is no transaction started -> Skipping rollback")
        }
    }
}

