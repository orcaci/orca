use actix_web::{Error, HttpRequest, HttpResponse, Responder, Scope, web};
use actix_web::web::Path;
use futures_util::StreamExt;
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
            .route("/{case_id}/detail/", web::get().to(get_case_info))
            .route("/{case_id}/item/", web::get().to(get_case_info))
            .route("/{case_id}/batch/", web::post().to(update_case_block))
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

/// get_case_info - Get Case Info
async fn get_case_info(path: Path<(Uuid, Uuid)>) -> Result<HttpResponse, OrcaError> {
    let (_, case_id) = path.into_inner();
    let cases = case::Entity::find_by_id(case_id)
        .one(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    if let Some(mut case) = cases {
        let _filter = Condition::all()
                    .add(case_block::Column::CaseId.eq(case_id));
        // let mut _case = case.into_active_model();
        let case_blocks = case_block::Entity::find().filter(_filter)
            .order_by_asc(case_block::Column::ExecutionOrder).all(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
        case.case_execution = Some(serde_json::to_value(case_blocks).expect("TODO: panic message"));
        return Ok(HttpResponse::Ok().json(case));
    };
    Ok(HttpResponse::NoContent().finish())
}

/// update_case_block - update Case Block
async fn update_case_block(path: Path<(Uuid, Uuid)>, mut body: web::Json<Vec<case_block::Model>>) -> Result<HttpResponse, OrcaError> {
    let (_, case_id) = path.into_inner();
    let case_blocks : Vec<case_block::ActiveModel> = body.into_iter().map(|mut block| {
        block.case_id = case_id.clone();
        block.into_active_model()
    }).collect();
    let blocks = case_block::Entity::insert_many(case_blocks)
        .exec(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    Ok(HttpResponse::NoContent().finish())
}