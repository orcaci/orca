
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct AuthData {
    pub username: String,
    pub password: String
}
