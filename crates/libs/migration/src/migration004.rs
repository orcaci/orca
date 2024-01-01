use sea_orm_migration::prelude::*;

use entity::test::history;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        //******************  Tag  ******************
        manager
            .create_table(
                Table::create()
                    .table(history::Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(history::Column::Id)
                            .integer()
                            .auto_increment()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(history::Column::Description).string())
                    .col(ColumnDef::new(history::Column::Kind).string().not_null())
                    .col(
                        ColumnDef::new(history::Column::HistoryType)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(history::Column::IsDryRun)
                            .boolean()
                            .not_null(),
                    )
                    .col(ColumnDef::new(history::Column::Args).json())
                    .col(ColumnDef::new(history::Column::Reference).uuid())
                    .col(
                        ColumnDef::new(history::Column::TriggeredOn)
                            .integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(history::Column::TriggeredBy)
                            .date_time()
                            .not_null(),
                    )
                    .to_owned(),
            )
            .await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(history::Entity).to_owned())
            .await?;
        Ok(())
    }
}
