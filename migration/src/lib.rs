pub use sea_orm_migration::prelude::*;

mod migration001;
mod migration002;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![Box::new(migration001::Migration)]
    }
}
