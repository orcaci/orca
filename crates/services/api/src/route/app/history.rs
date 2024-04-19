use axum::{Extension, Json, Router};
use axum::extract::Path;
use axum::response::IntoResponse;
use axum::routing::get;
use uuid::Uuid;

use entity::prelude::ItemLogType;

use crate::error::InternalResult;
use crate::server::session::OrcaSession;
use crate::service::app::history::HistoryService;

/// history_route - this will register all the endpoint in Execution history route
pub(crate) fn history_route() -> Router {
    Router::new()
        .nest("/:history_id", Router::new()
            .route("/log", get(by_id)).route("/log/:log_type/:log_id/blocks", get(log_by_id)),
        )
        .route("/", get(get_history))
}

/// get_action - list all the Action Group in Specific Application in the Orca Application
async fn get_history(
    Extension(session): Extension<OrcaSession>,
    Path(_app_id): Path<Uuid>,
) -> InternalResult<impl IntoResponse> {
    let result = HistoryService::new(session).list_history().await?;
    Ok(Json(result))
}


/// by_id - list all the Log list in Specific Application in the Orca Application
async fn by_id(
    Extension(session): Extension<OrcaSession>,
    Path((app_id, history_id)): Path<(Uuid, i32)>,
) -> InternalResult<impl IntoResponse> {
    let result = HistoryService::new(session).by_id(history_id).await?;
    Ok(Json(result))
}


/// log_by_id - list all the Log list in Specific Application in the Orca Application
async fn log_by_id(
    Extension(session): Extension<OrcaSession>,
    Path((app_id, history_id, log_type, log_id)): Path<(Uuid, i32, ItemLogType, Uuid)>,
) -> InternalResult<impl IntoResponse> {
    let result = HistoryService::new(session).log_by_id(history_id, log_type, log_id).await?;
    Ok(Json(result))
}

