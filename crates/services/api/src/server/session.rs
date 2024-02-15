use std::sync::Arc;
use sea_orm::DatabaseTransaction;

#[derive(Clone)]
pub struct OrcaSession(DatabaseTransaction);

impl OrcaSession {
    pub fn new(trx: DatabaseTransaction) -> Self {
        OrcaSession(trx)
    }
    pub fn trx(&self) -> &DatabaseTransaction {
        &self.0
    }
}
