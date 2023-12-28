use sea_orm::prelude::Uuid;
use tower_http::request_id::{MakeRequestId, RequestId};
use tracing::info;

// A `MakeRequestId` that increments an atomic counter
#[derive(Clone, Default)]
pub struct OrcaRequestId;

impl MakeRequestId for OrcaRequestId {
    fn make_request_id<B>(&mut self, request: &axum::http::Request<B>) -> Option<RequestId> {
        let id = Uuid::new_v4();
        info!("Request ID - {:?}", id);
        Some(RequestId::new(id.to_string().parse().unwrap()))
    }
}