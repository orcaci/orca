use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{get, post, put};
use axum::{Extension, Json, Router};
use sea_orm::prelude::Uuid;
use serde_json::json;

use entity::test::ui::action::action::Model;

use crate::error::InternalResult;
use crate::server::session::OrcaSession;
use crate::service::app::action::ActionService;

/// action_route - this will register all the endpoint in ACTION route
pub(crate) fn action_route() -> Router {
    Router::new()
        .route("/", get(get_action).post(create_action))
        .route("/batch", post(batch_update_action))
        .route("/:action_id", put(update_action).delete(delete_action))
}

/// get_action - list all the Action Group in Specific Application in the Orca Application
async fn get_action(
    Extension(session): Extension<OrcaSession>,
    Path((_app_id, group_id)): Path<(Uuid, Uuid)>,
) -> InternalResult<impl IntoResponse> {
    let result = ActionService::new(session).get_actions(group_id).await?;
    Ok(Json(result))
}

/// create_action - this will create new Action Group in Application Application in Orca
async fn create_action(
    Extension(session): Extension<OrcaSession>,
    Path((_app_id, group_id)): Path<(Uuid, Uuid)>,
    Json(body): Json<Model>,
) -> InternalResult<impl IntoResponse> {
    let result = ActionService::new(session)
        .create_action(group_id, body)
        .await?;
    Ok((StatusCode::CREATED, Json(result)))
}

/// batch_update_action - This will update batch Action Group in Application in Orca
async fn batch_update_action(
    Extension(session): Extension<OrcaSession>,
    Path((_app_id, group_id)): Path<(Uuid, Uuid)>,
    Json(body): Json<Vec<Model>>,
) -> InternalResult<impl IntoResponse> {
    let response = ActionService::new(session)
        .batch_update_action(group_id, body)
        .await?;
    Ok(Json(response))
}

/// update_action - this will create new Application in Orca
async fn update_action(
    Extension(session): Extension<OrcaSession>,
    Path((_app_id, _group_id, action_id)): Path<(Uuid, Uuid, Uuid)>,
    Json(body): Json<Model>,
) -> InternalResult<impl IntoResponse> {
    let result = ActionService::new(session)
        .update_action(action_id, body)
        .await?;
    Ok(Json(result))
}

/// delete_action - this will delete Action for Action Group in Application in Orca
async fn delete_action(
    Extension(session): Extension<OrcaSession>,
    Path((_app_id, _group_id, action_id)): Path<(Uuid, Uuid, Uuid)>,
) -> InternalResult<impl IntoResponse> {
    ActionService::new(session).delete_action(action_id).await?;
    Ok(Json(json!({"status": "success"})))
}
