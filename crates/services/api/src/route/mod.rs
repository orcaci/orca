use crate::route::public::local_route;
use axum::Router;
use serde::Deserialize;

pub(crate) mod admin;
pub(crate) mod app;
pub(crate) mod public;

fn v1_route() -> Router {
    Router::new()
        .nest("/user", admin::user::user_route())
        .nest("/app", app::app_route())
}

pub fn handle_router() -> Router {
    let api_routes = Router::new().nest("/v1", v1_route());
    let routes = Router::new()
        .nest("/", local_route())
        .nest("/api", api_routes);
    routes
}

#[derive(Deserialize)]
pub struct Pagination {
    pub offset: u64,
    pub limit: u64,
}

impl Pagination {
    pub fn offset(&self) -> u64 {
        self.offset
    }
    pub fn limit(&self) -> u64 {
        self.limit
    }
}

impl Default for Pagination {
    fn default() -> Self {
        Self {
            offset: 1,
            limit: 10,
        }
    }
}
