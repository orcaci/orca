use actix_http::HttpMessage;
use actix_web::{web, Responder, Scope, HttpRequest, HttpResponse};
use base::utils::request::query_params;
use entity::{prelude::*, user};
use sea_orm::Set;
use sea_orm::ActiveModelTrait;
use crate::server::context::request::RequestContext;

/// register - this will register all the endpoint in admin route
pub fn admin_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/admin")
                .service(
                    web::scope("/user")
                        .route("/", web::get().to(get_users))
                        .route("/", web::post().to(create_user))
                        .route("/{id}", web::delete().to(get_user))
                        .route("/{id}", web::put().to(get_user))
                        .route("/{id}", web::get().to(get_user)),
                )
                .service(
                    web::scope("/role")
                        .route("/", web::get().to(get_users))
                        .route("/", web::post().to(get_users))
                        .route("/{id}", web::delete().to(get_user))
                        .route("/{id}", web::put().to(get_user))
                        .route("/{id}", web::get().to(get_user)),
        )
    );
}


async fn create_user(req: &HttpRequest, user: web::Json<user::User>) -> impl Responder {
    // let params = query_params(req);
    let request_ctx = req.extensions().get::<RequestContext>().unwrap();
    let db = request_ctx.database();
    let u = user.into_inner();
    let f = user::ActiveModel {
        first_name: Set(u.first_name.to_owned()),
        last_name: Set(u.last_name.to_owned()),
        email: Set(u.email.to_owned()),
        name: Set(u.name.to_owned()),
        ..Default::default()
    }.insert(&db.conn).await;
    let f = match f {
        Ok(file) => file,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    HttpResponse::Created().json(f)
}

async fn get_users() -> impl Responder {
    "Hello world!"
}

async fn get_user(path: web::Path<(u32,)>) -> impl Responder {
    format!("Hello Dude")
}
