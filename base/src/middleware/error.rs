// use std::pin::Pin;
// use std::task::{Context, Poll};

use actix_web::middleware::{ErrorHandlerResponse};
use actix_web::{
    dev,
    http::header, Result,
};
use log::debug;

// pub struct ErrorHandler;

// impl<S, B> Transform<S> for ErrorHandler
// where
//     S: Service<Request = ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
//     S::Future: 'static,
//     B: 'static,
// {
//     type Request = ServiceRequest;
//     type Response = ServiceResponse<B>;
//     type Error = Error;
//     type InitError = ();
//     type Transform = ErrorHandlerMiddleware<S>;
//     type Future = Ready<Result<Self::Transform, Self::InitError>>;

//     fn new_transform(&self, service: S) -> Self::Future {
//         ok(ErrorHandlerMiddleware { service })
//     }
// }

// pub struct ErrorHandlerMiddleware<S> {
//     service: S,
// }

// impl<S, B> Service for ErrorHandlerMiddleware<S>
// where
//     S: Service<Request = ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
//     S::Future: 'static,
//     B: 'static,
// {
//     type Request = ServiceRequest;
//     type Response = ServiceResponse<B>;
//     type Error = Error;
//     type Future = Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>>>>;

//     fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
//         self.service.poll_ready(cx)
//     }

//     fn call(&mut self, req: ServiceRequest) -> Self::Future {
//         println!("Hi from start. You requested: {}", req.path());

//         let fut = self.service.call(req);

//         Box::pin(async move {
//             let res = fut.await?;

//             println!("Hi from response");
//             Ok(res)
//         })
//     }
// }

pub fn add_error_header<B>(mut res: dev::ServiceResponse<B>) -> Result<ErrorHandlerResponse<B>> {
    res.response_mut().headers_mut().insert(
        header::CONTENT_TYPE,
        header::HeaderValue::from_static("Error"),
    );
    Ok(ErrorHandlerResponse::Response(res.map_into_left_body()))
}