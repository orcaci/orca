use actix_web::{web, Responder, Scope, HttpRequest, HttpResponse, http};
use actix_web::web::Path;
use crate::core::utils::request::generate_success_response;
use entity::{prelude::*, profile, profile_data, user};
use crate::server::context::request::RequestContext;
use sea_orm::ActiveModelTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use sea_orm::QueryFilter;
use sea_orm::ColumnTrait;
use sea_orm::Set;

/// profile_config - this will register all the endpoint in profile route
pub fn profile_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/profile")
            .route("/", web::get().to(get_profiles))
            .route("/", web::post().to(create_profile))
            .route("/{id}", web::get().to(get_profile))
            .route("/{id}", web::delete().to(delete_profile))
            .route("/{id}", web::put().to(delete_profile))
            .route("/{id}/data/", web::post().to(add_profile_data))
            .route("/{id}/data/", web::get().to(get_profile_data))
            .route("/{id}/data/{data_id}", web::delete().to(delete_profile_data))
    );

}

/// list all the User Profile in the Orca Application
async fn get_profiles() -> impl Responder {
    let mut request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let _profiles = profile::Entity::find().order_by_asc(profile::Column::Name).all(&db.conn).await;
    let response = match _profiles {
        Ok(_profile) => _profile,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    print!("{:?}", response);
    HttpResponse::Ok().json(response)
}

/// Create New profile Set Value
async fn create_profile(profile: web::Json<profile::Profile>) -> impl Responder {
    let mut request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let _profile = profile.into_inner();
    let f = profile::ActiveModel {
        name: Set(_profile.name.to_owned()),
        is_default: Set(_profile.is_default.to_owned()),
        ..Default::default()
    }.insert(&db.conn).await;
    let f = match f {
        Ok(file) => file,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    HttpResponse::Created().json(f)
}

/// Get the Single profile Info with the data
async fn get_profile(path: Path<i32>) -> impl Responder {
    let id = path.into_inner();
    let mut request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let existing_profile = profile::Entity::find_by_id(id).one(&db.conn).await;
    let response = match existing_profile {
        Ok(_profile) => _profile,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    if response.is_none() {
        return generate_success_response(Some(http::StatusCode::NOT_FOUND),
                                         Some("Profile Not Found".parse().unwrap()), None);
    }
    Ok(HttpResponse::Ok().json(response))
}

/// Delete the Single profile With ID
async fn delete_profile(path: Path<i32>) -> impl Responder {
    let id = path.into_inner();
    let mut request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let existing_profile = profile::Entity::delete_by_id(id).exec(&db.conn).await;
    let _profile = match existing_profile {
        Ok(_profile) => _profile,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    generate_success_response(None, None, None)
}


/// Add the Single profile data into profile with ID
async fn add_profile_data(path: Path<i32>, _profile_data: web::Json<profile_data::ProfileData>) -> impl Responder {
    let id = path.into_inner();
    let mut request_ctx = RequestContext::default();
    let db = request_ctx.database();
    // let _profile: profile::ActiveModel = profile::Entity::find_by_id(id).one(&db.conn).await
    //     .unwrap().unwrap().into();
    let _profile = _profile_data.into_inner();
    let f = profile_data::ActiveModel {
        name: Set(_profile.name.to_owned()),
        value: Set(_profile.value.to_owned()),
        profile_id:Set(id),
        ..Default::default()
    }.insert(&db.conn).await;
    let f = match f {
        Ok(file) => file,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    HttpResponse::Created().json(f)
}

/// Get the Single profile Info with the data
async fn get_profile_data(path: Path<i32>) -> impl Responder {
    let id = path.into_inner();
    let mut request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let _profiles = profile_data::Entity::find().filter(profile_data::Column::ProfileId.eq(id))
        .order_by_asc(profile_data::Column::Id).all(&db.conn).await;
    let response = match _profiles {
        Ok(_profile) => _profile,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    HttpResponse::Ok().json(response)
}

/// Delete the Single profile data
async fn delete_profile_data(path: Path<(i32, i32)>) -> impl Responder {
    let (_profile_id, data_id) = path.into_inner();
    let mut request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let _profile_data = profile_data::Entity::delete_by_id(data_id).exec(&db.conn).await;
    let _profile = match _profile_data {
        Ok(_profile) => _profile,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    generate_success_response(None, None, None)
}


