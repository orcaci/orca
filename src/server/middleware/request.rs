use std::future::{ready, Ready};
use actix_http::HttpMessage;

use actix_web::{dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform}, Error, services, web};
use actix_web::web::service;
use futures_util::future::LocalBoxFuture;
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
        req = RequestContext::set_request_value(req);
        let fut = self.service.call(req);

        Box::pin(async move {
            println!("Before Request called");
            let res = fut.await?;
            println!("After Request called");
            Ok(res)
        })
    }
}