

#[cfg(test)]
mod tests {
    use cerium::client::db::client::DBClient;
    use cerium::client::db::trx::DBTrx;

    #[test]
    async fn test_check_client() {
        let client = DBClient::create("surreal_db".to_string()).await.expect("panic messag");
        let trx = client.create_trx().await;
        println!("This record will be captured by `cargo test`");
    }
}