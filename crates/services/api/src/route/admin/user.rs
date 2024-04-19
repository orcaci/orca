use axum::{Extension, Json, Router};
use axum::extract::{Path, Query};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{get, post};
use sea_orm::ActiveValue::Set;
use sea_orm::IntoActiveModel;
use serde_json::json;
use tracing::info;

use entity::admin::user;

use crate::error::InternalResult;
use crate::route::Pagination;
use crate::server::session::OrcaSession;
use crate::service::admin::user::UserService;

pub(crate) fn user_route() -> Router {
    Router::new()
        .route("/", post(create_user).get(list_user))
        .route(
            "/:user_id",
            get(get_user_by_id)
                .put(update_user_by_id)
                .delete(delete_user_by_id),
        )
}

/// create_user - this will create new User in Orca
async fn create_user(
    Extension(session): Extension<OrcaSession>,
    Json(body): Json<user::Model>,
) -> InternalResult<impl IntoResponse> {
    let result = UserService::new(session)
        .create_user(body.into_active_model())
        .await?;
    Ok((StatusCode::CREATED, Json(result)))
}

/// list_user - this will list User in Orca
async fn list_user(
    Extension(session): Extension<OrcaSession>,
    page: Option<Query<Pagination>>,
) -> InternalResult<impl IntoResponse> {
    let _page = page.unwrap_or_default().0;
    let result = UserService::new(session).list_users(_page).await?;
    Ok(Json(result))
}

/// get_user - this will get User by ID in Orca
async fn get_user_by_id(
    Extension(session): Extension<OrcaSession>,
    Path(user_id): Path<String>,
) -> InternalResult<impl IntoResponse> {
    let result = UserService::new(session).get_user_by_id(user_id).await?;
    Ok(Json(result))
}

/// update_user_by_id - update user by user ID in Orca
async fn update_user_by_id(
    Extension(session): Extension<OrcaSession>,
    Path(user_id): Path<String>,
    Json(body): Json<user::Model>,
) -> InternalResult<impl IntoResponse> {
    let mut _user = body.clone().into_active_model();
    _user.id = Set(user_id.clone());
    let result = UserService::new(session).update_user(_user).await?;
    info!("User Got Updated - {:?}", user_id);
    Ok(Json(result))
}

/// delete_user_by_id - delete user by User by ID in Orca
async fn delete_user_by_id(
    Extension(session): Extension<OrcaSession>,
    Path(user_id): Path<String>,
) -> InternalResult<impl IntoResponse> {
    UserService::new(session).delete_user_by_id(user_id).await?;
    Ok(Json(json!({"status": "success"})))
}
