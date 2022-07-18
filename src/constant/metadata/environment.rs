
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Environment {
    pub name: String,
    pub is_default: bool,
    pub data: Option<Vec<EnvironmentData>>
}

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct EnvironmentData {
    pub name: String,
    pub value: String
}

impl Environment {
    /// Convert the Environment to ActiveModel
    pub(crate) fn get_active_model(&self) {

    }
}