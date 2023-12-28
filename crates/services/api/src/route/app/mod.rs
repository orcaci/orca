use axum::{Extension, Json, Router};
use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{get, put};
use uuid::Uuid;

use entity::app::app::Model;

use crate::error::InternalResult;
use crate::route::app::action::action_route;
use crate::route::app::case::test_case_route;
use crate::route::app::datatable::datatable_route;
use crate::route::app::group::group_route;
use crate::route::app::profile::profile_route;
use crate::route::app::suit::suite_route;
use crate::server::session::OrcaSession;
use crate::service::app::AppService;

pub(crate) mod action;
pub(crate) mod group;
pub(crate) mod profile;
pub(crate) mod datatable;
pub(crate) mod suit;
pub(crate) mod case;


pub fn app_route() -> Router {
    Router::new()
        .route("/", get(get_app).post(create_app))
        .nest(
            "/:app_id",
            Router::new()
                .route("/", put(update_app))
                .nest(
                    "/group",
                    group_route()
                        .merge(
                            Router::new().nest("/:group_id/action", action_route())
                        )
                )
                .nest(
                    "/profile",
                    profile_route()
                )
                .nest(
                    "/datatable",
                    datatable_route()
                )
                .nest(
                    "/case",
                    test_case_route()
                )
                .nest(
                    "/suite",
                    suite_route()
                )
        )
}


/// get_app - list all the Application in the Orca Application
async fn get_app(Extension(session): Extension<OrcaSession>) -> InternalResult<impl IntoResponse> {
    println!("Heelo");
    let result = AppService::new(session).list_apps().await?;
    Ok(Json(result))
}


/// create_app - this will create new Application in Orca
async fn create_app(Extension(session): Extension<OrcaSession>,
                    Json(body): Json<Model>) -> InternalResult<impl IntoResponse> {
    let result = AppService::new(session).create_app(body).await?;
    Ok((StatusCode::CREATED, Json(result)))
}

/// update_app - this will update Application in Orca
async fn update_app(Extension(session): Extension<OrcaSession>,
                    Path(_app_id): Path<Uuid>,
                    Json(body): Json<Model>) -> InternalResult<impl IntoResponse> {
    Ok(Json(body))
}
