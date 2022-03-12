use sea_orm::DatabaseConnection;


pub struct Database {
    connection_url: String,
    conn: DatabaseConnection,
}

impl Database {
    pub async fn new(connection_url: String) -> Self {
        let conn = sea_orm::Database::connect(&connection_url).await.unwrap();
        Database {
            connection_url,
            conn,
        }
    }
}
