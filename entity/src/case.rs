use serde::{Serialize, Deserialize};

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ch {
    pub id: String,
    pub name: String,
    pub actors: Vec<Actor>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Case {
    pub id: String,
    pub execution_order: i64,
    pub kind: String,
    pub type_field: String,
    pub reference: String,
    // pub filter: Option<Filter>,
    pub actors: Vec<Actor>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Filter {
    pub scenario: String,
    pub case: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Actor {
    pub execution_order: i64,
    pub action_kind: String,
    pub action_reference: String,
    pub data_binding: Vec<DataBinding>,
    pub description: Option<String>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct DataBinding {
    pub key: String,
    pub value: String,
}
