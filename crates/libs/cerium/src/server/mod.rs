use std::sync::{Arc, Mutex};

use axum::{Router, serve};
use axum::http::{HeaderName, Method};
use sea_orm::DatabaseConnection;
use tokio::net::TcpListener;
use tower_http::{
    compression::CompressionLayer,
    cors::{Any, CorsLayer},
};
use tower_http::catch_panic::CatchPanicLayer;
use tower_http::request_id::{PropagateRequestIdLayer, SetRequestIdLayer};
use tower_http::trace::TraceLayer;
use tracing::{info, Level};
use tracing_subscriber::fmt;
use tracing_subscriber::layer::SubscriberExt;

use crate::client::Client;
use crate::server::request_id::OrcaRequestId;

mod request_id;
mod utils;

#[derive(Clone)]
pub struct AppState {
    pub db: Arc<Mutex<DatabaseConnection>>,
}

pub struct App {
    name: String,
    port: i32,
    log_level: Level,
    router: Router,
    cli: Client,
}

impl App {
    pub fn new(name: &str, cli: Client) -> Self {
        Self {
            name: name.to_string(),
            port: 80,
            log_level: Level::INFO,
            router: Default::default(),
            cli,
        }
    }

    pub fn set_logger(&self, filter: Level) {
        fmt()
            // .with(tracing_subscriber::fmt::layer())
            // .with_target(true)
            // .with_timer(tracing_subscriber::fmt::time::uptime())
            // .with_level(true)
            .with_max_level(filter)
            .init()
    }

    pub fn set_port(&mut self, port: i32) {
        self.port = port
    }

    fn app_state(&mut self) -> AppState {
        AppState {
            db: Arc::new(Mutex::new(self.cli.clone().db)),
        }
    }

    pub fn set_router(&mut self, router: Router) {
        let x_request_id = HeaderName::from_static("x-request-id");
        let cors = CorsLayer::new()
            .allow_methods([Method::GET, Method::POST])
            .allow_origin(Any);
        let router = router
            // .with_state(self.app_state())
            .layer(SetRequestIdLayer::new(
                x_request_id.clone(),
                OrcaRequestId::default(),
            ))
            .layer(PropagateRequestIdLayer::new(x_request_id))
            .layer(cors)
            .layer(CompressionLayer::new())
            .layer(CatchPanicLayer::new())
            .layer(TraceLayer::new_for_http());
        self.router = router
    }

    pub async fn run(self) {
        let listener = TcpListener::bind(format!("0.0.0.0:{:?}", self.port))
            .await
            .unwrap();
        info!("🚀 Starting Server ");
        serve(listener, self.router).await.unwrap();
    }
}
