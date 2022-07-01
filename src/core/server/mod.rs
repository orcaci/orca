pub mod context;

// use std::cell::RefCell;
// use actix_web::middleware::{Logger, ErrorHandlers, Compress};
// use actix_web::{App, HttpServer};
// use actix_web::dev::{HttpServiceFactory};


// #[derive(Clone, Debug)]
// pub struct Server {
//     name: String,
//     port: i8,
//     // scopes: Option<Vec<Scope>>,
//     services: Vec<Box<dyn HttpServiceFactory>>,
// }

// impl Server {
//     pub fn new(name: String, port: i8) -> Self {
//         Server {
//             name,
//             port,
//             services: None,
//         }
//     }

//     pub fn default() -> Self {
//         Self::new("Orca".to_string(), 8080)
//     }

//     // pub fn append_scope(mut self, scope: Scope) -> Self {
//     //     if let Some(x) = self.scopes {
//     //         x.borrow_mut().push(scope);
//     //     } else {
//     //         self.scopes = Some(vec![scope]);
//     //     }
//     //     self
//     // }

//     pub fn run(&self) {
//         println!("{}", self.name);
//         println!("{}", self.port);
//         let app = App::new().wrap(Logger::default()).service();
//         let hs = HttpServer::new(|| {
            
//                 // .wrap(ErrorHandlers::new().handler(
//                 //     http::StatusCode::INTERNAL_SERVER_ERROR,
//                 //     error::add_error_header,
//                 // ))
//                 // .wrap(Compress::default())
//                 // .service(route::register())
//                 // .service(route::admin::register())
//                 // .service(route::ws::register())
//         })
//     }
// }