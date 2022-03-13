use actix_web::{web, Responder, Scope, HttpRequest};
use base::utils::request::query_params;
use crate::entity::prelude::*;

/// register - this will register all the endpoint in admin route
pub fn register() -> Scope {
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
}

async fn create_user(req: HttpRequest, mut user: web::Json<User>) -> impl Responder {
    let params = query_params(req);
    let client = base::client::Client::default();
    let db = client.database();
    let u = user.into_inner();
    // let _user =  User::ActiveModel{
    //     name: u.name.,
    //     email: u.email,
    //     first_name: u.first_name,

    // };
    u.insert(db).await;
    "Hello world!"
}

async fn get_users() -> impl Responder {
    "Hello world!"
}

async fn get_user(path: web::Path<(u32,)>) -> impl Responder {
    format!("Hello world! {:?}", path.0)
}
