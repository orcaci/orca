use actix_web::{web, Responder, Scope, HttpRequest};
use base::utils::request::query_params;
use entity::{prelude::*, user};

/// profile_config - this will register all the endpoint in profile route
pub fn profile_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/profile")
            .route("/", web::get().to(get_profiles))
            .route("/", web::post().to(create_profile))
            .route("/{id}", web::get().to(get_profile))
            .route("/{id}", web::delete().to(delete_profile))
            .route("/{id}/data/", web::post().to(add_profile_data))
            .route("/{id}/data/", web::get().to(get_profile_data))
            .route("/{id}/data/{data_id}", web::delete().to(delete_profile_data))
    );

}

/// list all the User Profile in the Orca Application
async fn get_profiles() -> impl Responder {
    "Hello world!"
}

/// Create New profile Set Value
async fn create_profile() -> impl Responder {
    "Hello world!"
}

/// Get the Single profile Info with the data
async fn get_profile() -> impl Responder {
    "Got Profile By ID"
}

/// Delete the Single profile With ID
async fn delete_profile() -> impl Responder {
    "Got Profile By ID"
}


/// Add the Single profile data into profile with ID
async fn add_profile_data() -> impl Responder {
    "Got Profile By ID"
}

/// Get the Single profile Info with the data
async fn get_profile_data() -> impl Responder {
    "Got Profile By ID"
}

/// Delete the Single profile data
async fn delete_profile_data() -> impl Responder {
    "delete Profile By ID"
}


