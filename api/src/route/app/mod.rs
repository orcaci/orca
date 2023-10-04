use std::error::Error;

use actix_web::{HttpResponse, web};
use sea_orm::{ActiveModelTrait, EntityTrait, IntoActiveModel, QueryOrder};
use sea_orm::prelude::Uuid;

use cerium::error::web::OrcaError;
use entity::app::app;

use crate::utils::config::CONFIG;

pub(crate) mod group;
pub(crate) mod action;
pub(crate) mod case;
pub(crate) mod suit;
pub(crate) mod profile;
pub(crate) mod object_repo;
pub(crate) mod datatable;


/// app_config - this will register all the endpoint in App route
pub fn app_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/app")
            .route("/", web::get().to(get_apps))
            .route("/", web::post().to(create_app))
            .service(
                web::scope("/{app_id}")
                    .route("/", web::put().to(create_app))
                    .configure(group::group_config)
                    .configure(case::test_case_config)
                    .configure(profile::profile_config)

                    .configure(datatable::datatable_config)
            )
    );

}


/// list all the Application in the Orca Application
async fn get_apps() -> Result<HttpResponse, OrcaError> {
    // let mut request_ctx = RequestContext::default();
    // let db = request_ctx.database();
    let cases = app::Entity::find().order_by_asc(app::Column::Name).all(&CONFIG.get().await.db_client).await;
    let response = match cases {
        Ok(_cases) => _cases,
        Err(error) => panic!("Error while inserting: {:?}", error),
    };
    Ok(HttpResponse::Ok().json(response))
}


/// create_app - this will create new Application in Orca
async fn create_app(mut body: web::Json<app::Model>) -> Result<HttpResponse, OrcaError> {
    // let mut request_ctx = RequestContext::default();
    // let db = request_ctx.database();
    body.id = Uuid::new_v4();
    let app = body.clone().into_active_model();
    let result = app.insert(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(result))
}

/// create_app - this will create new Application in Orca
async fn update_app(mut body: web::Json<app::Model>) -> Result<HttpResponse, OrcaError> {
    // let mut request_ctx = RequestContext::default();
    // let db = request_ctx.database();
    body.id = Uuid::new_v4();
    let app = body.clone().into_active_model();
    let result = app.insert(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(result))
}



