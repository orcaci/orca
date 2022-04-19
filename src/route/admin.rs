use actix_http::{HttpMessage, StatusCode};
use actix_web::{Error, HttpRequest, HttpResponse, Responder, Scope, web};
use actix_web::web::Path;
use base::utils::request::query_params;
use entity::{prelude::*, user};
use entity::user_group::Relation::User;
use sea_orm::ActiveModelTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use sea_orm::QueryFilter;
use sea_orm::ColumnTrait;
use sea_orm::Set;

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
                    web::scope("/role")
                        .route("/", web::get().to(get_user_s))
                        .route("/", web::post().to(get_user_s))
                        .route("/{id}", web::delete().to(get_user_s))
                        .route("/{id}", web::put().to(get_user_s))
                        .route("/{id}", web::get().to(get_user_s)),
        )
    );
}

/// Get the user Based on the filter
async fn get_users() -> HttpResponse {
    let request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let users = user::Entity::find().filter(user::Column::IsActive.eq(true))
        .order_by_asc(user::Column::Name).all(&db.conn).await;
    let response = match users {
        Ok(_users) => _users,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    HttpResponse::Ok().json(response)
}


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
        ..Default::default()
    }.insert(&db.conn).await;
    let f = match f {
        Ok(file) => file,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    HttpResponse::Created().json(f)
}

async fn update_user(path: Path<i32>, user: web::Json<user::User>) -> impl Responder {
    let id = path.into_inner();
    let request_ctx = RequestContext::default();
    let db = request_ctx.database();
    let u = user.into_inner();
    let _user = user::ActiveModel {
        first_name: Set(u.first_name.to_owned()),
        last_name: Set(u.last_name.to_owned()),
        email: Set(u.email.to_owned()),
        name: Set(u.name.to_owned()),
        ..Default::default()
    }.save(&db.conn).await;
    let response = match _user {
        Ok(file) => file,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    todo!("need to test this and fix this up");
    HttpResponse::Ok()
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
    let user = user::Entity::find_by_id(id).one(&db.conn).await;
    let response = match user {
        Ok(_users) => _users,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    HttpResponse::Ok().json(response)
}

async fn get_user_s(path: web::Path<(u32,)>) -> impl Responder {
    format!("Hello Dude")
}
