
use axum::{Extension, Json, Router};
use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{delete, get, post, put};
use sea_orm::prelude::Uuid;
use serde_json::json;
use entity::test::profile::profile::Model;


use crate::error::InternalResult;
use crate::server::session::OrcaSession;
use crate::service::app::profile::ProfileService;

/// profile_route - this will register all the endpoint in profile route
pub(crate) fn profile_route() -> Router {
    Router::new()
        .route("/", get(list_profile).post(create_profile))
        .nest("/:profile_id",
               Router::new()
                   .route("/", put(update_profile).delete(delete_profile))
                   .route("/data/batch", delete(update_profile))
                   .route("/data/{data_id}", delete(delete_profile_data))

        )
}

/// list_profile - list all the Profile that is Binded with Current Application
async fn list_profile(Extension(session): Extension<OrcaSession>,
                    Path(app_id): Path<Uuid>) -> InternalResult<impl IntoResponse> {
    let result = ProfileService::new(session, app_id).list_profile().await?;
    Ok(Json(result))
}


/// create_profile - This will New Profile for the specific Application in Orca
async fn create_profile(Extension(session): Extension<OrcaSession>, Path(app_id): Path<Uuid>,
                       Json(body): Json<Model>) -> InternalResult<impl IntoResponse> {
    let result = ProfileService::new(session, app_id).create_profile(body).await?;
    Ok((StatusCode::CREATED, Json(result)))
}

/// update_profile - this will update the existing profile information in Orca
async fn update_profile(Extension(session): Extension<OrcaSession>,
                        Path((app_id, profile_id)): Path<(Uuid, Uuid)>,
                        Json(body): Json<Model>) -> InternalResult<impl IntoResponse> {
    let result = ProfileService::new(session, app_id).update_profile(profile_id, body).await?;
    Ok(Json(result))
}

/// delete_profile - this will delete existing profile in Application Application in Orca
async fn delete_profile(Extension(session): Extension<OrcaSession>,
                        Path((app_id, profile_id)): Path<(Uuid, Uuid)>) -> InternalResult<impl IntoResponse> {
    let result = ProfileService::new(session, app_id).delete_profile(profile_id).await?;
    Ok(Json(json!({"status": "success"})))
}

/// delete_profile_data - this will delete existing profile data in Application Application in Orca
async fn delete_profile_data(Extension(session): Extension<OrcaSession>,
                       Path((app_id, profile_id, data_id)): Path<(Uuid, Uuid, Uuid)>) -> InternalResult<impl IntoResponse> {
    let result = ProfileService::new(session, app_id).delete_profile_data(data_id).await?;
    Ok(Json(json!({"status": "success"})))
}

