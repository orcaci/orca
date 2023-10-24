use actix_web::{HttpResponse, web};
use actix_web::web::Path;
use log::debug;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, EntityTrait, IntoActiveModel, QueryOrder, QuerySelect};
use sea_orm::ActiveValue::Set;
use sea_orm::prelude::Uuid;
use entity::test::ui::suit::{suite, suite_block};
use crate::error::OrcaError;
use crate::utils::config::CONFIG;
use sea_orm::QueryFilter;
use entity::{prelude::*};
use crate::route::app::case::QueryParams;

pub fn test_suit_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/suite")
            .route("/", web::get().to(get_suites))
            .route("/", web::post().to(create_suit))

            .route("/{suite_id}/detail/", web::get().to(get_suite_info))
            .route("/{suite_id}/batch/", web::post().to(batch_update_suite_block))

            // .route("/{suite_id}/block/{case_block_id}/", web::post().to(update_case_block))
            .route("/{suite_id}/insert/", web::post().to(push_block))
            // .route("/{suit_id}/detail/", web::get().to(get_case_info))
    );

}

/// list all the test suites in the Orca Application
async fn get_suites(path: Path<Uuid>) -> Result<HttpResponse, OrcaError> {
    let app_id = path.into_inner();
    let _filter = Condition::all()
        .add(suite::Column::AppId.eq(app_id));
    let suites = suite::Entity::find().filter(_filter)
        .order_by_asc(suite::Column::Name).all(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(suites))
}


async fn create_suit(path: Path<Uuid>, mut body: web::Json<suite::Model>) -> Result<HttpResponse, OrcaError> {
    let app_id = path.into_inner();
    body.id = Uuid::new_v4();
    body.app_id = app_id;
    let _case = body.clone().into_active_model();
    let result = _case.insert(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(result))
}



/// get_suits_info - Get Suite Info and the batch information with the list of block
async fn get_suite_info(path: Path<(Uuid, Uuid)>) -> Result<HttpResponse, OrcaError> {
    let (_, suite_id) = path.into_inner();
    let suites = suite::Entity::find_by_id(suite_id)
        .one(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    if let Some(mut suite) = suites {
        let _filter = Condition::all()
            .add(suite_block::Column::SuiteId.eq(suite_id));
        let suite_blocks = suite_block::Entity::find().filter(_filter)
            .order_by_asc(suite_block::Column::ExecutionOrder).all(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
        suite.suite_execution = Some(serde_json::to_value(suite_blocks).expect("TODO: panic message"));
        return Ok(HttpResponse::Ok().json(suite));
    };
    Ok(HttpResponse::NoContent().finish())
}

/// batch_update_suite_block - update suite Block
async fn batch_update_suite_block(path: Path<(Uuid, Uuid)>, mut body: web::Json<Vec<suite_block::Model>>) -> Result<HttpResponse, OrcaError> {
    let (_, suite_id) = path.into_inner();
    let suite_blocks : Vec<suite_block::ActiveModel> = body.clone().into_iter().map(|mut block| {
        block.suite_id = suite_id.clone();
        block.into_active_model()
    }).collect();
    let blocks = suite_block::Entity::insert_many(suite_blocks)
        .exec(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    Ok(HttpResponse::NoContent().finish())
}
//
// /// push_into_index - This will Append New Block to the code for spe
// async fn push_into_index(path: Path<(Uuid, Uuid, i32)>, mut body: web::Json<case_block::Model>, param: web::Query<QueryParams>) -> Result<HttpResponse, OrcaError> {
//     let (_, case_id, index) = path.into_inner();
//
//     let mut _filter = Condition::all()
//         .add(case_block::Column::CaseId.eq(case_id));
//     if param.parent.is_some() {
//         _filter = _filter.add(case_block::Column::ParentId.eq(param.parent.unwrap()));
//     }
//
//     let _index : i32 = match param.index {
//         Some(x) => x,
//         _ => {
//             let mut i = 1;
//             let blocks =  case_block::Entity::find().filter(_filter.clone())
//                 .all(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
//             if let Some(b) = blocks.last() {
//                 i = b.execution_order + 1;
//             }
//             i
//         }
//     };
//     _filter = _filter.add(case_block::Column::ExecutionOrder.gte(index));
//
//
//     let blocks =  case_block::Entity::find().filter(_filter)
//         .all(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
//     for block in blocks {
//         let new_order = block.execution_order + 1;
//         let mut action_model = block.into_active_model();
//         action_model.execution_order = Set(new_order);
//         action_model.save(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
//     }
//     body.id = Uuid::new_v4();
//     body.case_id = case_id;
//     let _case = body.clone().into_active_model();
//     debug!("{:?}", _case);
//     let result = _case.insert(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
//     Ok(HttpResponse::NoContent().finish())
// }


/// push_block - This will Append New Block to the code for spe
async fn push_block(path: Path<(Uuid, Uuid)>, mut body: web::Json<suite_block::Model>, param: web::Query<QueryParams>) -> Result<HttpResponse, OrcaError> {
    let (_, suite_id) = path.into_inner();

    let mut _filter = Condition::all()
        .add(suite_block::Column::SuiteId.eq(suite_id));
    // if param.parent.is_some() {
    //     _filter = _filter.add(case_block::Column::ParentId.eq(param.parent.unwrap()));
    // }
    let blocks =  suite_block::Entity::find().filter(_filter.clone())
        .order_by_desc(suite_block::Column::ExecutionOrder).limit(1)
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
    _filter = _filter.add(suite_block::Column::ExecutionOrder.gte(_index));


    let blocks =  suite_block::Entity::find().filter(_filter)
        .all(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    for block in blocks {
        let new_order = block.execution_order + 1;
        let mut action_model = block.into_active_model();
        action_model.execution_order = Set(new_order);
        action_model.save(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    }
    body.id = Uuid::new_v4();
    body.suite_id = suite_id;
    body.execution_order = _index;
    let _suite = body.clone().into_active_model();
    debug!("{:?}", _suite);
    let result = _suite.insert(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    Ok(HttpResponse::NoContent().finish())
}
