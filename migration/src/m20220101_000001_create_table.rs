use entity::user;
use sea_schema::migration::{
    *,
    sea_query::*
};

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20220101_000001_create_table"
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.create_table(Table::create().table(user::Entity)
                                .if_not_exists()
                                .col(
                                    ColumnDef::new(user::Column::Id)
                                        .integer()
                                        .not_null()
                                        .auto_increment()
                                        .primary_key(),
                                )
                                .col(ColumnDef::new(user::Column::FirstName).text().not_null())
                                .col(ColumnDef::new(user::Column::LastName).text().not_null())
            .col(ColumnDef::new(user::Column::Email).text().not_null())
            .col(ColumnDef::new(user::Column::IsActive).boolean().not_null().default(false))
                                .col(ColumnDef::new(user::Column::Name).text().not_null())
                                .to_owned(),).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(user::Entity).to_owned())
            .await
    }
}
