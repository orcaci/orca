use std::io::Error;
use actix_web::{http, HttpResponse, Responder, web};
use actix_web::error::ErrorUnauthorized;
use actix_web::web::Path;
use base::error::OrcaResult;
use base::utils::request::generate_success_response;
use entity::{group, user};
use sea_orm::ActiveModelTrait;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use sea_orm::Set;
use serde_json::Value;

use crate::server::context::request::RequestContext;

/// register - this will register all the endpoint in admin route
pub fn admin_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/admin")
                .service(
                    web::scope("/user")
                        .route("/", web::get().to(get_users))
                        .route("/", web::post().to(create_user))
                        .route("/{id}", web::put().to(update_user))
                        .route("/{id}", web::delete().to(delete_user))
                        .route("/{id}", web::get().to(get_user)),
                )
                .service(
                    web::scope("/group")
                        .route("/", web::get().to(get_groups))
                        .route("/", web::post().to(get_user_s))
                        .route("/{id}", web::delete().to(get_user_s))
                        .route("/{id}", web::put().to(get_user_s))
                        .route("/{id}", web::get().to(get_user_s)),
        )
    );
}

/// Get the user Based on the filter
async fn get_users() -> OrcaResult {
    // let request_ctx = RequestContext::default();
    // let db = request_ctx.database();
    // let users = user::Entity::find().filter(user::Column::IsActive.eq(true))
    //     .order_by_asc(user::Column::Name).all(&db.conn).await
    //     .map_err(|data| ErrorUnauthorized(data))?;
    // Ok(HttpResponse::Ok().json(users))
    Err(Error::from_raw_os_error(22))
}


/// Create User for orca
async fn create_user(user: web::Json<user::User>) -> impl Responder {
    // let params = query_params(req);
    let request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let u = user.into_inner();
    let f = user::ActiveModel {
        first_name: Set(u.first_name.to_owned()),
        last_name: Set(u.last_name.to_owned()),
        email: Set(u.email.to_owned()),
        name: Set(u.name.to_owned()),
        is_active: Set(u.is_active.to_owned().or(Some(false)).unwrap()),
        ..Default::default()
    }.insert(&db.conn).await;
    let f = match f {
        Ok(file) => file,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    HttpResponse::Created().json(f)
}

async fn update_user(path: Path<i32>, body: web::Json<Value>) -> impl Responder {
    let id = path.into_inner();
    let request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let existing_user = user::Entity::find_by_id(id).one(&db.conn).await.unwrap();
    if existing_user.is_none() {
        return generate_success_response(Some(http::StatusCode::NOT_FOUND),
                                         Some("User Not Found".parse().unwrap()), None);
    }
    let mut _user: user::ActiveModel = existing_user.unwrap().into();
    _user.name = Set(body.get("name").and_then(Value::as_str).unwrap_or(&_user.name.take().unwrap()).to_owned());
    _user.first_name = Set(body.get("first_name").and_then(Value::as_str).unwrap_or(&_user.first_name.take().unwrap()).to_owned());
    _user.last_name = Set(Some(body.get("last_name").and_then(Value::as_str).unwrap().to_owned()));
    _user.is_active = Set(body.get("is_active").and_then(Value::as_bool).unwrap().to_owned());
    let response = _user.save(&db.conn).await;
    let _response = match response {
        Ok(file) => file,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    generate_success_response(None, None, None)
}

async fn delete_user(path: Path<i32>) -> impl Responder {
    let id = path.into_inner();
    let request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let user: user::ActiveModel = user::Entity::find_by_id(id).one(&db.conn)
        .await
        .unwrap()
        .unwrap()
        .into();
    user.delete(&db.conn).await.unwrap();
    HttpResponse::NoContent()
}


async fn get_user(path: Path<i32>) -> impl Responder {
    let id = path.into_inner();
    let request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let existing_user = user::Entity::find_by_id(id).filter(user::Column::IsActive.eq(true))
        .one(&db.conn).await;
    let response = match existing_user {
        Ok(_users) => _users,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    if response.is_none() {
        return generate_success_response(Some(http::StatusCode::NOT_FOUND),
                                         Some("User Not Found".parse().unwrap()), None);
    }
    Ok(HttpResponse::Ok().json(response))
}

/// Get the groups in Orca Based on the filter
async fn get_groups() -> Result<HttpResponse, Error> {
    // let request_ctx = RequestContext::default();
    // let db = request_ctx.database();
    // let groups = group::Entity::find().order_by_asc(user::Column::Name).all(&db.conn).await
    //     .map_err(|data| ErrorUnauthorized(data))?;
    Ok(HttpResponse::from(HttpResponse::Ok())) //.json(groups))
}

async fn get_user_s(path: web::Path<(u32,)>) -> impl Responder {
    format!("Hello Dude")
}
