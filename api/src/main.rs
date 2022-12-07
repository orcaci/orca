extern crate cerium;

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct UserNew {
    pub name: String,
    pub first_name: String,
    pub last_name: String,
}

fn main() {
    let a = cerium::User {
        name: "".to_string(),
        first_name: "".to_string(),
        last_name: "".to_string(),
    };
    let b = UserNew {
        name: "".to_string(),
        first_name: "".to_string(),
        last_name: "".to_string(),
    };
    println!("Hello, world! {:?}", a);
    println!("Hello, world! {:?}", b);
}
