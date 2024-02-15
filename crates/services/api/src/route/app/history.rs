use axum::{Extension, Json, Router};
use axum::extract::Path;
use axum::response::IntoResponse;
use axum::routing::get;
use uuid::Uuid;

use crate::error::InternalResult;
use crate::server::session::OrcaSession;
use crate::service::app::history::HistoryService;

/// history_route - this will register all the endpoint in Execution history route
pub(crate) fn history_route() -> Router {
    Router::new()
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
