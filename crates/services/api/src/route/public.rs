use axum::response::IntoResponse;
use axum::routing::get;
use axum::Router;

pub fn local_route() -> Router {
    Router::new().route("/ping", get(health_checker_handler))
}

async fn health_checker_handler() -> impl IntoResponse {
    const MESSAGE: &str = "Pong";
    MESSAGE
}
