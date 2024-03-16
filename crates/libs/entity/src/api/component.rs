use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Root {
    pub id: i32,
    pub openapi: String,
    pub info: Info,
    pub external_docs: ExternalDocs,
    pub servers: Vec<Server>,
    pub tags: Vec<Tag>,
    pub paths: Vec<Path>,
    pub components: Components,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Path {
    pub id: i32,
    pub path: String,
    pub method: String,
    pub tags: Vec<String>,
    pub summary: String,
    pub description: String,
    pub operation_id: String,
    pub parameters: Vec<Parameter>,
    pub responses: Value,
    pub request_body: Value,
    pub security: Vec<Value>,
}


#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Parameter {
    pub name: String,
    #[serde(rename = "in")]
    pub in_field: String,
    pub description: String,
    pub required: bool,
    pub explode: bool,
    pub schema: Schema,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Schema {
    #[serde(rename = "type")]
    pub type_field: String,
    pub default: Option<String>,
    pub format: Option<String>,
    #[serde(rename = "enum")]
    pub enum_field: Option<Vec<String>>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Info {
    pub title: String,
    pub description: String,
    pub terms_of_service: String,
    pub contact: Contact,
    pub license: License,
    pub version: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Contact {
    pub email: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct License {
    pub name: String,
    pub url: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExternalDocs {
    pub description: String,
    pub url: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Server {
    pub url: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Tag {
    pub name: String,
    pub description: String,
    pub external_docs: Option<ExternalDocs2>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExternalDocs2 {
    pub description: String,
    pub url: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Components {
    pub schemas: Value,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Schemas {
    // #[serde(rename = "Order")]
    // pub order: Order,
    // #[serde(rename = "Customer")]
    // pub customer: Customer,
    // #[serde(rename = "Address")]
    // pub address: Address2,
    // #[serde(rename = "Category")]
    // pub category: Category,
    // #[serde(rename = "User")]
    // pub user: User2,
    // #[serde(rename = "Tag")]
    // pub tag: Tag2,
    // #[serde(rename = "Pet")]
    // pub pet: Pet2,
    // #[serde(rename = "ApiResponse")]
    // pub api_response: ApiResponse,
}