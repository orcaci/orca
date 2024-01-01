use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{get, put};
use axum::{Extension, Json, Router};
use sea_orm::prelude::Uuid;

use entity::prelude::group::Model;

use crate::error::InternalResult;
use crate::server::session::OrcaSession;
use crate::service::app::group::GroupService;

/// group_route - this will register all the endpoint in ACTION group route
pub(crate) fn group_route() -> Router {
    Router::new()
        .route("/", get(get_groups).post(create_group))
        .route(
            "/:group_id",
            put(update_action_group).delete(delete_action_group),
        )
}

/// get_groups - list all the Action Group in Specific Application in the Orca Application
async fn get_groups(
    Extension(session): Extension<OrcaSession>,
    Path(app_id): Path<Uuid>,
) -> InternalResult<impl IntoResponse> {
    let result = GroupService::new(session).get_groups(app_id).await?;
    Ok(Json(result))
}

/// create_group - This will create new Action Group in Application in Orca
async fn create_group(
    Extension(session): Extension<OrcaSession>,
    Path(app_id): Path<Uuid>,
    Json(body): Json<Model>,
) -> InternalResult<impl IntoResponse> {
    let result = GroupService::new(session)
        .create_group(app_id, body)
        .await?;
    Ok((StatusCode::CREATED, Json(result)))
}

/// update_action_group - this will create new Application in Orca
async fn update_action_group(
    Extension(session): Extension<OrcaSession>,
    Path((_app_id, group_id)): Path<(Uuid, Uuid)>,
    Json(body): Json<Model>,
) -> InternalResult<impl IntoResponse> {
    let result = GroupService::new(session)
        .update_action_group(group_id, body)
        .await?;
    Ok(Json(result))
}

/// delete_action_group - this will delete Action Group in Application Application in Orca
async fn delete_action_group(
    Extension(session): Extension<OrcaSession>,
    Path((_app_id, group_id)): Path<(Uuid, Uuid)>,
) -> InternalResult<impl IntoResponse> {
    let result = GroupService::new(session).delete_group(group_id).await?;
    Ok(Json(result))
}
