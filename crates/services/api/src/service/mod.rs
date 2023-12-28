use axum::async_trait;
use sea_orm::{ActiveModelBehavior, ActiveModelTrait, DatabaseTransaction, ModelTrait};
use crate::error::InternalResult;

pub(crate) mod admin;
pub(crate) mod app;


// #[async_trait]
// pub trait CrudService {
//
//     fn trx(&self) -> &DatabaseTransaction;
//
//     async fn new<AM, M>(self, am: AM) -> InternalResult<M>
//     where
//         AM: ActiveModelTrait,
//         M: ModelTrait
//     {
//         let result = am.insert(self.trx()).await?;
//         // Ok(result)
//     }
// }