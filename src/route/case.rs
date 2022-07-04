use actix_web::{Error, HttpRequest, HttpResponse, Responder, Scope, web};
use actix_web::web::Path;
use crate::core::utils::request::generate_success_response;
use entity::{prelude::*, profile, profile_data, user};
use entity::{test_case, test_step};
use sea_orm::{ActiveModelTrait, InsertResult};
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use sea_orm::Set;
use serde_json::Value;

use crate::server::context::request::RequestContext;

/// profile_config - this will register all the endpoint in profile route
pub fn test_case_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/case")
            .route("/", web::get().to(get_cases))
            .route("/", web::post().to(create_case))
            .route("/{id}", web::get().to(get_profile))
            .route("/{id}", web::delete().to(get_profile))
            .route("/{id}/data/", web::post().to(get_profile))
            .route("/{id}/data/batch/", web::post().to(create_batch_step))
            .route("/{id}/data/", web::get().to(get_profile))
            .route("/{id}/data/{data_id}", web::delete().to(get_profile))
    );

}

/// list all the test cases in the Orca Application
async fn get_cases() -> Result<HttpResponse, Error> {
    let mut request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let cases = test_case::Entity::find().order_by_asc(test_case::Column::Name).all(&db.conn).await;
    let response = match cases {
        Ok(_cases) => _cases,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    Ok(HttpResponse::Ok().json(response))
}

/// Create New test case
async fn create_case(body: web::Json<Value>) -> impl Responder {
    let mut request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let _c = test_case::ActiveModel {
        name: Set(body.get("name").and_then(Value::as_str).unwrap().to_owned()),
        is_deleted: Set(false),
        ..Default::default()
    }.insert(&db.conn).await;
    let f = match _c {
        Ok(file) => file,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    HttpResponse::Created().json(f)
}

/// Create batch step for test case
async fn create_batch_step(path: Path<i32>, body: web::Json<Vec<test_step::TestStep>>) -> impl Responder {
    let id = path.into_inner();
    let mut request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let mut _steps: Vec<test_step::ActiveModel> = vec![];
    for step in body.iter() {
        let _step = test_step::ActiveModel {
            command: Set(step.command.to_owned()),
            target: Set(step.target.to_owned()),
            value: Set(step.value.to_owned()),
            output: Set(step.output.to_owned()),
            desc: Set(step.desc.to_owned()),
            test_case_id: Set(id),
            exection_order: Set(step.exection_order.to_owned()),
            ..Default::default()
        };
        _steps.push(_step);
    }

    let res = test_step::Entity::insert_many(_steps).exec(&db.conn).await;
    let _f = match res {
        Ok(file) => file,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    generate_success_response(None, None, None)
}
/// Get the Single profile Info with the data
async fn get_profile() -> impl Responder {
    "Got Profile By ID"
}