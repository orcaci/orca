pub use sea_orm_migration::prelude::*;

mod migration001;
mod migration002;
mod migration003;
mod migration004;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(migration001::Migration),
            Box::new(migration002::Migration),
            Box::new(migration003::Migration),
        ]
    }
}
