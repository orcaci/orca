// 1.4.0
use std::sync::Mutex;

use futures::executor;
use lazy_static::lazy_static;

pub mod database;
pub mod redis;


lazy_static! {
    pub static ref CLIENT: Mutex<Client> = Mutex::new(Client::default());
}

#[derive(Debug, Clone, Default)]
pub struct Client {
    database: Option<database::Database>,
    redis: Option<redis::Redis>,
}

impl Client {
    pub fn default() -> Self {
        Client {
            database: None,
            redis: None,
        }
    }

    pub fn database(mut self) -> database::Database {
        if let Some(x) = self.database.clone() {
            return x;
        } else {
            let future_db = database::Database::new(super::CONFIG.database.url.clone());
            let database = executor::block_on(future_db); //"sqlite::memory:".to_string())); //
            self.database = Some(database.clone());
            return database;
        }
    }
}


#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let cli = super::Client::default();
        let database = cli.database();
    }
}
