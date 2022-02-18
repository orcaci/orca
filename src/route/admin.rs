use actix_web::{web, Responder, Scope};

/// register - this will register all the endpoint in admin route
pub fn register() -> Scope {
    web::scope("/admin").service(
        web::scope("/user")
            .route("/", web::get().to(get_users))
            .route("/", web::post().to(get_users))
            .route("/{id}", web::delete().to(get_user))
            .route("/{id}", web::put().to(get_user))
            .route("/{id}", web::get().to(get_user)),
    )
}

async fn get_users() -> impl Responder {
    "Hello world!"
}

async fn get_user(path: web::Path<(u32,)>) -> impl Responder {
    format!("Hello world! {:?}", path.0)
}
