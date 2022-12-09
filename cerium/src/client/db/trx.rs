use std::future::IntoFuture;
use std::rc::Rc;
use surrealdb_rs::param::Root;
use surrealdb_rs::protocol::Ws;
use surrealdb_rs::{Connect, Result, Surreal};
use surrealdb_rs::method::{Begin, Transaction};
use surrealdb_rs::net::WsClient;
use crate::error::{CeriumError, CeriumResult};


pub struct DBTrx {
    pub(crate) client: Rc<Surreal<WsClient>>,
    trx: Transaction<WsClient>
}

impl DBTrx {
    // /// begin - is function that will begin the transaction in Database Connection
    // pub async fn new(client: Rc<Surreal<WsClient>>) -> CeriumResult<DBTrx> {
    //     let trx: Transaction<WsClient> = client.clone().transaction().into_future().
    //         await.map_err(|data| CeriumError::DatabaseClientError(data))?;
    //     Ok(DBTrx{
    //         client,
    //         trx
    //     })
    // }
    //
    // /// commit - is function that will Complete the transaction in Database Connection
    // /// move the content to
    // pub async fn commit(&self) -> Result<()> {
    //     self.trx.commit().await?;
    //     Ok(())
    // }
    //
    // /// rollback - is function that will rollback the transaction in Database Connection
    // pub async fn rollback(&self) -> Result<()> {
    //     self.trx.cancel().await?;
    //     Ok(())
    // }
}