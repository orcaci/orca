use sea_orm::DbErr;
use thiserror::Error;

pub type EntityResult<T> = Result<T, EntityError>;

#[derive(Error, Debug)]
pub enum EntityError {
    #[error("Failed to convert Active Model : {0}")]
    FailedActiveModelConvert(DbErr),
}