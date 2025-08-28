use std::sync::Arc;
use sea_orm::DatabaseTransaction;

pub struct OrcaSession(Arc<DatabaseTransaction>);

impl OrcaSession {
    pub fn new(trx: DatabaseTransaction) -> Self {
        OrcaSession(Arc::new(trx))
    }
    pub fn trx(&self) -> &DatabaseTransaction {
        &self.0
    }
}

impl Clone for OrcaSession {
    fn clone(&self) -> Self {
        OrcaSession(Arc::clone(&self.0))
    }
}