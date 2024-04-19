use sea_orm::DatabaseTransaction;

#[derive(Clone)]
pub struct OrcaSession(DatabaseTransaction, String);

impl OrcaSession {
    pub fn new(trx: DatabaseTransaction, user_id: String) -> Self {
        OrcaSession(trx, user_id)
    }
    pub fn trx(&self) -> &DatabaseTransaction {
        &self.0
    }

    /// user_id - returns the user_id
    pub fn user_id(&self) -> &str {
        &self.1
    }
}
