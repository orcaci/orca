use std::io::Error;
use actix_http::HttpMessage;

use actix_web::{http, HttpRequest, HttpResponse, Responder, web};
use actix_web::web::Path;
use crate::core::error::{OrcaError, OrcaResult};
use crate::core::utils::request::generate_success_response;
use entity::{group, user};
use sea_orm::ActiveModelTrait;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use sea_orm::Set;
use serde_json::Value;
use crate::core;

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

/// get_users - Get the user from the admin management and request
async fn get_users(mut request_ctx: RequestContext) -> OrcaResult {
    let db = request_ctx.database();
    let users = user::Entity::find().filter(user::Column::IsActive.eq(true))
        .order_by_asc(user::Column::Name).all(&db.conn).await
        .map_err(|data| OrcaError::DBError(data))?;
    Ok(HttpResponse::Ok().json(users))
    // Err(OrcaError::Forbidden)
}

/// create_user - Create the user in the admin management in InActive state
/// This will be activated by the admin using active endpoint
async fn create_user(mut request_ctx: RequestContext, user: web::Json<user::User>) -> OrcaResult {
    // let params = query_params(req);
    let db = request_ctx.database();
    let u = user.into_inner();
    let user_response = user::ActiveModel {
        first_name: Set(u.first_name.to_owned()),
        last_name: Set(u.last_name.to_owned()),
        email: Set(u.email.to_owned()),
        name: Set(u.name.to_owned()),
        is_active: Set(u.is_active.to_owned().or(Some(false)).unwrap()),
        ..Default::default()
    }.insert(&db.conn).await.map_err(|data| OrcaError::DBError(data))?;
    Ok(HttpResponse::Created().json(user_response))
}

/// update_user - Update the user in the admin management
/// For now we will allow the user to update the is_active field
async fn update_user(mut request_ctx: RequestContext, path: Path<i32>, body: web::Json<Value>) -> OrcaResult {
    let id = path.into_inner();
    let db = request_ctx.database();
    let existing_user = user::Entity::find_by_id(id).one(&db.conn).await.map_err(|data| OrcaError::DBError(data))?;
    if existing_user.is_none() {
        return Err(OrcaError::UserNotFound(id));
    }
    let mut _user: user::ActiveModel = existing_user.unwrap().into();
    _user.name = Set(body.get("name").and_then(Value::as_str).unwrap_or(&_user.name.take().unwrap()).to_owned());
    _user.first_name = Set(body.get("first_name").and_then(Value::as_str).unwrap_or(&_user.first_name.take().unwrap()).to_owned());
    _user.last_name = Set(Some(body.get("last_name").and_then(Value::as_str).unwrap().to_owned()));
    _user.is_active = Set(body.get("is_active").and_then(Value::as_bool).unwrap().to_owned());
    let _response = _user.save(&db.conn).await.map_err(|data| OrcaError::DBError(data))?;
    generate_success_response(None, None, None)
}

async fn delete_user(mut request_ctx: RequestContext, path: Path<i32>) -> OrcaResult {
    let id = path.into_inner();
    let db = request_ctx.database();
    let existing_user = user::Entity::find_by_id(id).one(&db.conn)
        .await.map_err(|data| OrcaError::DBError(data))?;
    if existing_user.is_none() {
        return Err(OrcaError::UserNotFound(id));
    }
    let existing_user: user::ActiveModel = existing_user.unwrap().into();
    existing_user.delete(&db.conn).await.map_err(|data| OrcaError::DBError(data))?;
    Ok(HttpResponse::from(HttpResponse::NoContent()))
}


async fn get_user(mut request_ctx: RequestContext, path: Path<i32>) -> OrcaResult {
    let id = path.into_inner();
    let db = request_ctx.database();
    let existing_user = user::Entity::find_by_id(id).filter(user::Column::IsActive.eq(true))
        .one(&db.conn).await.map_err(|data| OrcaError::DBError(data))?;
    if existing_user.is_none() {
        return Err(OrcaError::UserNotFound(id));
    }
    Ok(HttpResponse::Ok().json(existing_user))
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
