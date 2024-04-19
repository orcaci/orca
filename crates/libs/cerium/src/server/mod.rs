use std::sync::{Arc, Mutex};
use std::time::Duration;

use axum::{Router, serve};
use axum::http::{HeaderName, Method};
use sea_orm::DatabaseConnection;
use tokio::net::TcpListener;
use tower_http::{
    catch_panic::CatchPanicLayer,
    compression::CompressionLayer,
    cors::{Any, CorsLayer},
};
use tower_http::classify::ServerErrorsFailureClass;
use tower_http::request_id::{PropagateRequestIdLayer, SetRequestIdLayer};
use tower_http::trace::TraceLayer;
use tracing::{error, info, Level, Span};
use tracing_subscriber::{filter, fmt};
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

use crate::client::Client;
use crate::server::request_id::OrcaRequestId;

mod request_id;
mod utils;

/// Represents the application state, containing a database connection wrapped in an `Arc<Mutex>`.
/// This struct is cloneable.
///
/// # Fields
///
/// - `db`: An `Arc<Mutex<DatabaseConnection>>` representing the database connection.
///
/// # Example
///
///
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

    /// Sets the logger with the specified log level filter.
    ///
    /// # Arguments
    ///
    /// - `filter`: A `Level` enum representing the log level filter.
    ///
    /// # Example
    ///
    /// ```
    /// use tracing::Level;
    ///
    /// let app = App::new("my_app", client);
    /// app.set_logger(Level::INFO);
    ///
    pub fn set_logger(&self, level: Level) {
        let filter = filter::Targets::new()
            .with_target("tower_http::trace::on_response", Level::TRACE)
            .with_target("tower_http::trace::on_request", Level::TRACE)
            .with_target("tower_http::trace::on_failure", Level::TRACE)
            .with_target("tower_http::trace::make_span", Level::DEBUG)
            .with_default(level);
        let tracing_layer = tracing_subscriber::fmt::layer();

        tracing_subscriber::registry()
            .with(tracing_layer)
            .with(filter)
            .init();
        // .with(tracing_subscriber::fmt::layer())
        // .with_target(true)
        // .with_timer(tracing_subscriber::fmt::time::uptime())
        // .with_level(true)
    }

    pub fn set_port(&mut self, port: i32) {
        self.port = port
    }

    fn app_state(&mut self) -> AppState {
        AppState {
            db: Arc::new(Mutex::new(self.cli.clone().db)),
        }
    }

    pub async fn set_router(&mut self, router: Router) {
        let x_request_id = HeaderName::from_static("x-request-id");
        let cors = CorsLayer::new()
            .allow_methods([Method::GET, Method::POST])
            .allow_origin(self.cli.env().await.cors_allowed_origin.clone());
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
            .layer(
                TraceLayer::new_for_http()
                // .on_failure(|error: ServerErrorsFailureClass, latency: Duration, _span: &Span| {
                //     let mut error_msg = format!("something went wrong: {:?}", error);
                //     let backtrace = backtrace::Backtrace::new();
                //     error_msg.push_str("\nBacktrace:\n");
                //     // error_msg.push_str(&backtrace);
                //     error!("{:?} - {:?} - {:#?}", error_msg, latency, backtrace);
                // })
            );
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
