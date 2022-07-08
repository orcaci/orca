use std::future::{ready, Ready};
use std::time::Instant;

use actix_http::header::{HeaderName, HeaderValue};
use actix_web::{dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform}, Error, web};
use actix_web::error::ErrorUnauthorized;
use actix_web::http::header;
use crate::core::constant::header::REQUEST_ID_HEADER;
use crate::core::utils::uuid::request_uuid;
use futures_util::future::LocalBoxFuture;
use log::info;

use crate::server::context::request::RequestContext;

// There are two steps in middleware processing.
// 1. Middleware initialization, middleware factory gets called with
//    next service in chain as parameter.
// 2. Middlewares call method gets called with normal request.
#[derive(Debug, Clone, Default)]
pub struct RequestHandler;

// Middleware factory is `Transform` trait
// `S` - type of the next service
// `B` - type of response's body
impl<S, B> Transform<S, ServiceRequest> for RequestHandler
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Transform = RequestHandlerMiddleware<S>;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(RequestHandlerMiddleware { service }))
    }
}

pub struct RequestHandlerMiddleware<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for RequestHandlerMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, mut req: ServiceRequest) -> Self::Future {
        let request_id = request_uuid();
        let start_time = Instant::now();
        info!("Starting the Request {}", &request_id.clone());
        let authorization = req.headers().get(header::AUTHORIZATION);
        if authorization.is_none() {
            return Box::pin(async { Err(ErrorUnauthorized("err")) });
        }
        req = RequestContext::set_request_value(req);
        let fut = self.service.call(req);
        Box::pin(async move {
            let mut res = fut.await?;
            res.headers_mut().insert(HeaderName::from_static(REQUEST_ID_HEADER),
                                     HeaderValue::from_str(&request_id).unwrap());
            info!("Completed Request after - {:?}", start_time.elapsed());
            Ok(res)
        })
    }
}