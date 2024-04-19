use std::sync::Arc;
use std::task::{Context, Poll};

use axum::{async_trait, extract::Request, response::Response};
use futures::executor::block_on;
use futures_util::future::BoxFuture;
use sea_orm::{DatabaseConnection, TransactionTrait};
use tower::{Layer, Service};
use tracing::{debug, info};

use crate::server::session::OrcaSession;

pub mod orca;

#[derive(Clone)]
pub struct OrcaLayer {
    pub db: Arc<DatabaseConnection>,
}

impl<S> Layer<S> for OrcaLayer {
    type Service = OrcaMiddleware<S>;

    fn layer(&self, inner: S) -> Self::Service {
        OrcaMiddleware {
            db: self.db.clone(),
            inner,
        }
    }
}

#[derive(Clone)]
pub struct OrcaMiddleware<S> {
    pub db: Arc<DatabaseConnection>,
    inner: S,
}

#[async_trait]
impl<S> Service<Request> for OrcaMiddleware<S>
    where
        S: Service<Request, Response=Response> + Send + 'static,
        S::Future: Send + 'static,
{
    type Response = S::Response;
    type Error = S::Error;
    // `BoxFuture` is a type alias for `Pin<Box<dyn Future + Send + 'a>>`
    type Future = BoxFuture<'static, Result<Self::Response, Self::Error>>;

    fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.inner.poll_ready(cx)
    }

    fn call(&mut self, mut request: Request) -> Self::Future {
        let ext = request.extensions_mut();
        info!(">>>>>>>>>--------------BEFORE REQUEST------------------>>>>>>>>>");
        let trx = block_on(self.db.begin()).expect("got error on trx");
        ext.insert(OrcaSession::new(trx.clone(), "system".to_string()));
        let future = self.inner.call(request);
        Box::pin(async move {
            let mut response: Response = future.await?;
            let headers = response.headers_mut();
            trx.commit().await.expect("TODO: panic message");
            debug!("headers - {:?}", headers);
            info!(">>>>>>>>>-------------AFTER REQUEST------------->>>>>>>>>");
            Ok(response)
        })
    }
}
