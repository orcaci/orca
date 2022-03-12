
// use lazy_static::lazy_static;

pub mod database;
pub mod redis;


// lazy_static! {
//     pub static ref DB = database::Database::new(super::CONFIG.database.url.clone()).await();
// }


// struct Client {
//     database: database::Database,
//     redis: redis::Redis,
// }

// impl Client {
//     async fn new() -> Self {
//         Client {
//             database: database::Database::new(super::CONFIG.database.url.clone()).await,
//             redis: redis::Redis::new(super::CONFIG.redis.url.clone()),
//         }
//     }
// }