use actix_web::{Error, HttpRequest, HttpResponse, Responder, Scope, web};
use actix_web::web::Path;
use sea_orm::{ActiveModelTrait, Condition, InsertResult, IntoActiveModel};
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::prelude::Uuid;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;

// use crate::core::utils::request::generate_success_response;
use entity::{prelude::*};

use crate::error::OrcaError;
use crate::utils::config::CONFIG;

/// profile_config - this will register all the endpoint in profile route
pub fn test_case_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/case")
            .route("/", web::get().to(get_cases))
            .route("/", web::post().to(create_case))
            // .route("/{id}", web::get().to(get_profile))
            // .route("/{id}", web::delete().to(get_profile))
            // .route("/{id}/data/", web::post().to(get_profile))
            // .route("/{id}/data/batch/", web::post().to(create_batch_step))
            // .route("/{id}/data/", web::get().to(get_profile))
            // .route("/{id}/data/{data_id}", web::delete().to(get_profile))
    );

}

/// list all the test cases in the Orca Application
async fn get_cases(path: Path<Uuid>) -> Result<HttpResponse, OrcaError> {
    let app_id = path.into_inner();
    let _filter = Condition::all()
                .add(case::Column::AppId.eq(app_id));
    let cases = case::Entity::find().filter(_filter)
        .order_by_asc(case::Column::Name).all(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(cases))
}

/// Create New test case
async fn create_case(path: Path<Uuid>, mut body: web::Json<case::Model>) -> Result<HttpResponse, OrcaError> {
    let app_id = path.into_inner();
    body.id = Uuid::new_v4();
    body.app_id = app_id;
    let _case = body.clone().into_active_model();
    let result = _case.insert(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(result))
}

// /// Create batch step for test case
// async fn create_batch_step(path: Path<i32>, body: web::Json<Vec<test_step::TestStep>>) -> impl Responder {
//     let id = path.into_inner();
//     let mut request_ctx = RequestContext::default();
//     let db = request_ctx.database();
//     let mut _steps: Vec<test_step::ActiveModel> = vec![];
//     for step in body.iter() {
//         let _step = test_step::ActiveModel {
//             command: Set(step.command.to_owned()),
//             target: Set(step.target.to_owned()),
//             value: Set(step.value.to_owned()),
//             output: Set(step.output.to_owned()),
//             desc: Set(step.desc.to_owned()),
//             test_case_id: Set(id),
//             exection_order: Set(step.exection_order.to_owned()),
//             ..Default::default()
//         };
//         _steps.push(_step);
//     }
//
//     let res = test_step::Entity::insert_many(_steps).exec(&db.conn).await;
//     let _f = match res {
//         Ok(file) => file,
//         Err(error) => panic!("Error while inserting: {:?}", error),
//     };
//     generate_success_response(None, None, None)
// }
// /// Get the Single profile Info with the data
// async fn get_profile() -> impl Responder {
//     "Got Profile By ID"
// }