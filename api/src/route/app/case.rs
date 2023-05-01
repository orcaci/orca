use actix_web::{Error, HttpRequest, HttpResponse, Responder, Scope, web};
use actix_web::web::Path;
use futures_util::StreamExt;
use log::debug;
use sea_orm::{ActiveModelTrait, Condition, InsertResult, IntoActiveModel, QuerySelect};
use sea_orm::ActiveValue::Set;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::prelude::Uuid;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use serde::{Deserialize};

// use crate::core::utils::request::generate_success_response;
use entity::{prelude::*};

use crate::error::OrcaError;
use crate::utils::config::CONFIG;

#[derive(Debug, Deserialize)]
pub struct QueryParams {
    index: Option<i32>,
    parent: Option<Uuid>,
}

/// profile_config - this will register all the endpoint in profile route
pub fn test_case_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/case")
            .route("/", web::get().to(get_cases))
            .route("/", web::post().to(create_case))
            .route("/{case_id}/detail/", web::get().to(get_case_info))
            .route("/{case_id}/batch/", web::post().to(batch_update_case_block))

            .route("/{case_id}/block/{case_block_id}/", web::post().to(update_case_block))
            .route("/{case_id}/insert/", web::post().to(push_block))
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

/// batch_update_case_block - update Case Block
async fn batch_update_case_block(path: Path<(Uuid, Uuid)>, mut body: web::Json<Vec<case_block::Model>>) -> Result<HttpResponse, OrcaError> {
    let (_, case_id) = path.into_inner();
    let case_blocks : Vec<case_block::ActiveModel> = body.clone().into_iter().map(|mut block| {
        block.case_id = case_id.clone();
        block.into_active_model()
    }).collect();
    let blocks = case_block::Entity::insert_many(case_blocks)
        .exec(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    Ok(HttpResponse::NoContent().finish())
}

/// push_into_index - This will Append New Block to the code for spe
async fn push_into_index(path: Path<(Uuid, Uuid, i32)>, mut body: web::Json<case_block::Model>, param: web::Query<QueryParams>) -> Result<HttpResponse, OrcaError> {
    let (_, case_id, index) = path.into_inner();

    let mut _filter = Condition::all()
        .add(case_block::Column::CaseId.eq(case_id));
    if param.parent.is_some() {
        _filter = _filter.add(case_block::Column::ParentId.eq(param.parent.unwrap()));
    }

    let _index : i32 = match param.index {
        Some(x) => x,
        _ => {
            let mut i = 1;
            let blocks =  case_block::Entity::find().filter(_filter.clone())
                .all(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
            if let Some(b) = blocks.last() {
                i = b.execution_order + 1;
            }
            i
        }
    };
    _filter = _filter.add(case_block::Column::ExecutionOrder.gte(index));


    let blocks =  case_block::Entity::find().filter(_filter)
        .all(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    for block in blocks {
        let new_order = block.execution_order + 1;
        let mut action_model = block.into_active_model();
        action_model.execution_order = Set(new_order);
        action_model.save(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    }
    body.id = Uuid::new_v4();
    body.case_id = case_id;
    let _case = body.clone().into_active_model();
    debug!("{:?}", _case);
    let result = _case.insert(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    Ok(HttpResponse::NoContent().finish())
}


/// push_block - This will Append New Block to the code for spe
async fn push_block(path: Path<(Uuid, Uuid)>, mut body: web::Json<case_block::Model>, param: web::Query<QueryParams>) -> Result<HttpResponse, OrcaError> {
    let (_, case_id) = path.into_inner();

    let mut _filter = Condition::all()
        .add(case_block::Column::CaseId.eq(case_id));
    if param.parent.is_some() {
        _filter = _filter.add(case_block::Column::ParentId.eq(param.parent.unwrap()));
    }
    let blocks =  case_block::Entity::find().filter(_filter.clone())
        .order_by_desc(case_block::Column::ExecutionOrder).limit(1)
        .all(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    let mut last_index = 1;
    if let Some(b) = blocks.last() {
        last_index = b.execution_order + 1;
    }
    let _index : i32 = match param.index {
        Some(x) => {
            let i = if x > last_index { last_index } else {x};
            i
        },
        _ => last_index
    };
    _filter = _filter.add(case_block::Column::ExecutionOrder.gte(_index));


    let blocks =  case_block::Entity::find().filter(_filter)
        .all(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    for block in blocks {
        let new_order = block.execution_order + 1;
        let mut action_model = block.into_active_model();
        action_model.execution_order = Set(new_order);
        action_model.save(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    }
    body.id = Uuid::new_v4();
    body.case_id = case_id;
    body.execution_order = _index;
    let _case = body.clone().into_active_model();
    debug!("{:?}", _case);
    let result = _case.insert(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    Ok(HttpResponse::NoContent().finish())
}

/// update_case_block - this will update the single case block
async fn update_case_block(path: Path<(Uuid, Uuid, Uuid)>, body: web::Json<case_block::Model>) -> Result<HttpResponse, OrcaError> {
    let (_, _, case_block_id) = path.into_inner();
    let case_block = case_block::Entity::find_by_id(case_block_id)
        .one(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    if let Some(_case_block) = case_block {
        let mut _block: case_block::ActiveModel = _case_block.into();
        _block.kind = Set(body.kind.to_owned());
        // _block.execution_order = Set(body.execution_order.to_owned());
        _block.type_field = Set(body.type_field.to_owned());
        _block.reference = Set(body.reference.to_owned());
        _block.parent_id = Set(body.parent_id.to_owned());
        let _ = _block.save(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
        return Ok(HttpResponse::NoContent().finish());
    }
    Ok(HttpResponse::NoContent().finish())
}