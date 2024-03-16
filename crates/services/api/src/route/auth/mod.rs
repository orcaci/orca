use axum::{Extension, Json, Router};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::post;
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::error::InternalResult;
use crate::server::session::OrcaSession;
use crate::service::admin::auth::AuthService;

pub(crate) fn auth_route() -> Router {
    Router::new()
        .nest("/auth",
              Router::new()
                  .route("/login",  post(user_login))
                  // .route("/password/reset",  post(user_login))
                  // .route("/signup",  post(user_login))
                  // .route("/google",  post(user_login))
                  // .route("/sso/callback",  post(user_login))
        )
        // .route("/login", post(user_login))
}

#[derive(Deserialize, Serialize)]
pub struct UserLogin {
    pub email: String,
    pub password: String,
}

/// user_login - login using username and password for the orca application
async fn user_login(
    Extension(session): Extension<OrcaSession>,
    Json(body): Json<UserLogin>,
) -> InternalResult<impl IntoResponse> {
    let _result = AuthService::new(session)
        .auth_user(body.email, body.password)
        .await?;
    Ok((StatusCode::OK, Json(json!({"message": "Login Success"}))))
}
