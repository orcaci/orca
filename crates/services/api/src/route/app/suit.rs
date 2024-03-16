use axum::{Extension, Json, Router};
use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{get, post};
use uuid::Uuid;

use entity::test::ui::suit::suite::Model;
use entity::test::ui::suit::suite_block::Model as BlockModel;

use crate::error::InternalResult;
use crate::server::session::OrcaSession;
use crate::service::app::suit::SuitService;

/// suite_route - this will register all the endpoint in Suit route
pub(crate) fn suite_route() -> Router {
    Router::new()
        .route("/", get(list_suites).post(create_suite))
        .nest(
            "/:suite_id",
            Router::new()
                .route("/batch/update", post(update_block))
                .nest(
                    "/block",
                    Router::new().route("/", get(get_suite_info).post(insert_block)),
                ),
        )
}

/// list_suites - list all the Suites that is Bind with Current Application
async fn list_suites(
    Extension(session): Extension<OrcaSession>,
    Path(app_id): Path<Uuid>,
) -> InternalResult<impl IntoResponse> {
    let result = SuitService::new(session, app_id).list_suites().await?;
    Ok(Json(result))
}

/// create_profile - This will New Profile for the specific Application in Orca
async fn create_suite(
    Extension(session): Extension<OrcaSession>,
    Path(app_id): Path<Uuid>,
    Json(body): Json<Model>,
) -> InternalResult<impl IntoResponse> {
    let result = SuitService::new(session, app_id).create_suit(body).await?;
    Ok((StatusCode::CREATED, Json(result)))
}

/// get_suits_info - Get Suite Info and the batch information with the list of block
async fn get_suite_info(
    Extension(session): Extension<OrcaSession>,
    Path((app_id, suite_id)): Path<(Uuid, Uuid)>,
) -> InternalResult<impl IntoResponse> {
    let result = SuitService::new(session, app_id)
        .get_suite_info(suite_id)
        .await?;
    Ok(Json(result))
}

/// insert_block - This will Append New Block to the code for spe
async fn insert_block(
    Extension(session): Extension<OrcaSession>,
    Path((app_id, suite_id)): Path<(Uuid, Uuid)>,
    Json(body): Json<BlockModel>,
) -> InternalResult<impl IntoResponse> {
    let result = SuitService::new(session, app_id)
        .push_block(suite_id, body, None)
        .await?;
    Ok(Json(result))
}

/// update_block - update suite Block
async fn update_block(
    Extension(session): Extension<OrcaSession>,
    Path((app_id, suite_id)): Path<(Uuid, Uuid)>,
    Json(body): Json<Vec<BlockModel>>,
) -> InternalResult<impl IntoResponse> {
    let result = SuitService::new(session, app_id)
        .batch_update_suite_block(suite_id, body)
        .await?;
    Ok(Json(result))
}
