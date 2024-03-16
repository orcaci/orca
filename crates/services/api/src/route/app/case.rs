use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{get, post};
use axum::{Extension, Json, Router};
use cerium::client::Client;
use entity::prelude::case::Model;
use entity::prelude::case_block::Model as BlockModel;
use uuid::Uuid;

use crate::error::InternalResult;
use crate::server::session::OrcaSession;
use crate::service::app::case::CaseService;

/// test_case_route - this will register all the endpoint in Suit route
pub(crate) fn test_case_route() -> Router {
    Router::new()
        .route("/", get(list_cases).post(create_case))
        .nest(
            "/:case_id",
            Router::new()
                .route("/detail", get(get_case_info))
                .route("/run", post(dry_run))
                .nest(
                    "/block",
                    Router::new()
                        .route("/batch", post(update_block))
                        .route("/", post(insert_block)),
                ),
        )
}

/// list_cases - list all the Case that is Bind with Current Application
async fn list_cases(
    Extension(session): Extension<OrcaSession>,
    Extension(cli): Extension<Client>,
    Path(app_id): Path<Uuid>,
) -> InternalResult<impl IntoResponse> {
    let result = CaseService::new(session, cli, app_id).list_cases().await?;
    Ok(Json(result))
}

/// create_case - This will New Test Case for the specific Application in Orca
async fn create_case(
    Extension(session): Extension<OrcaSession>,
    Extension(cli): Extension<Client>,
    Path(app_id): Path<Uuid>,
    Json(body): Json<Model>,
) -> InternalResult<impl IntoResponse> {
    let result = CaseService::new(session, cli, app_id)
        .create_case(body)
        .await?;
    Ok((StatusCode::CREATED, Json(result)))
}

/// get_case_info - Get Case Info and the batch information with the list of block
async fn get_case_info(
    Extension(session): Extension<OrcaSession>,
    Extension(cli): Extension<Client>,
    Path((app_id, case_id)): Path<(Uuid, Uuid)>,
) -> InternalResult<impl IntoResponse> {
    let result = CaseService::new(session, cli, app_id)
        .get_case_info(case_id)
        .await?;
    Ok(Json(result))
}

/// dry_run - Dry run the Test case
async fn dry_run(
    Extension(session): Extension<OrcaSession>,
    Extension(cli): Extension<Client>,
    Path((app_id, case_id)): Path<(Uuid, Uuid)>,
) -> InternalResult<impl IntoResponse> {
    let result = CaseService::new(session, cli, app_id).run(case_id).await?;
    Ok(Json(result))
}

/// update_block - update test case Block
async fn update_block(
    Extension(session): Extension<OrcaSession>,
    Extension(cli): Extension<Client>,
    Path((app_id, case_id)): Path<(Uuid, Uuid)>,
    Json(body): Json<Vec<BlockModel>>,
) -> InternalResult<impl IntoResponse> {
    let result = CaseService::new(session, cli, app_id)
        .batch_update_case_block(case_id, body)
        .await?;
    Ok(Json(result))
}

/// insert_block - This will Append New Block to the code for spe
async fn insert_block(
    Extension(session): Extension<OrcaSession>,
    Extension(cli): Extension<Client>,
    Path((app_id, case_id)): Path<(Uuid, Uuid)>,
    Json(body): Json<BlockModel>,
) -> InternalResult<impl IntoResponse> {
    let result = CaseService::new(session, cli, app_id)
        .push_block(case_id, body, None, None)
        .await?;
    Ok(Json(result))
}

// /// push_block - This will New Block to the code
// async fn push_block(Extension(session): Extension<OrcaSession>,
//                            Path((app_id, case_id)): Path<(Uuid, Uuid)>,
//                            Json(body): Json<BlockModel>) -> InternalResult<impl IntoResponse> {
//     let result = CaseService::new(session, app_id).push_block(case_id, body, None).await?;
//     Ok(Json(result))
// }
