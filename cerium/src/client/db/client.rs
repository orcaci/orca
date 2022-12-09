use std::rc::Rc;
use surrealdb_rs::param::Root;
use surrealdb_rs::protocol::Ws;
use surrealdb_rs::{Connect, Result, Surreal};
use surrealdb_rs::method::{Begin, Transaction};
use surrealdb_rs::net::WsClient;
use crate::client::db::trx::DBTrx;
use crate::error::{CeriumError, CeriumResult};



pub struct DBClient {
    client: Rc<Surreal<WsClient>>,
}

impl DBClient {
    /// create - is function to create a new Database Client to do all the Database interaction
    pub async fn create(con_url: String) -> CeriumResult<Self> {
        let client : Surreal<WsClient> = Surreal::connect::<Ws>(con_url).
            await.map_err(|data| CeriumError::DatabaseClientError(data))?;
        Ok(DBClient{ client: Rc::new(client) })
    }

    // pub async fn start(&self) -> CeriumResult<DBTrx> {
    //     DBTrx::new(&self.client).await
    // }


    // pub async fn create_trx(&self) -> CeriumResult<Transaction<WsClient>> {
    //     let trx: Transaction<WsClient> = self.client.transaction().
    //         await.map_err(|data| CeriumError::DatabaseClientError(data))?;
    //     Ok(trx)
    //
    // }
}


