use actix_web::{web, http, Result, HttpResponse, HttpRequest};
use serde_json::{Value};
use serde::{Deserialize, Serialize};
use crate::core::error::{OrcaError, OrcaResult};

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct QueryParam {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<i8>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<i8>,
}

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Reponse {
    pub status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<Value>,
}

pub fn generate_success_response(status_code: Option<http::StatusCode>, status: Option<String>, data: Option<Value>) -> OrcaResult {
    let _status = status.unwrap_or("success".into());
    let response = Reponse {
        status: _status,
        data: data.clone(),
    };
    let _status_code = status_code.unwrap_or(http::StatusCode::OK);
    Ok(HttpResponse::build(_status_code)
        .content_type("application/json").json(response))
}

pub fn query_params(req: HttpRequest) -> QueryParam {
    let mut params = web::Query::<QueryParam>::from_query(req.query_string()).unwrap().0;
    params.page = Some(params.page.unwrap_or(1));
    params.limit = Some(params.limit.unwrap_or(10));
    return params;
}