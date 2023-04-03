
use actix_web::{HttpResponse, web};
use actix_web::web::Path;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, IntoActiveModel, ModelTrait, NotSet, QueryFilter, QueryOrder, Value};
use sea_orm::ActiveValue::Set;
use sea_orm::prelude::Uuid;

use cerium::error::web::OrcaError;
use entity::prelude::group;
use entity::test::ui::action::{action, datatable};

use crate::utils::config::CONFIG;

/// datatable_config - this will register all the endpoint in Datatable route
pub fn datatable_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/datatable")
            .route("/", web::get().to(get_datatables))
            .route("/", web::post().to(create_datatable))
            .route("/{table_id}/", web::put().to(update_action))
            .route("/{table_id}/", web::delete().to(delete_action))
    );

}


/// get_datatable - list all the DataTable in Specific Application in the Orca
async fn get_datatables(path: Path<(Uuid)>) -> Result<HttpResponse, OrcaError> {
    let app_id = path.into_inner();
    let tables = datatable::Entity::find().filter(datatable::Column::AppId.eq(app_id))
        .order_by_asc(datatable::Column::Name).all(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(tables))
}


/// create_datatable - this will create new DataTable in Application in Orca
async fn create_datatable(path: Path<(Uuid)>, mut body: web::Json<datatable::Model>) -> Result<HttpResponse, OrcaError> {
    let app_id = path.into_inner();
    body.id = Uuid::new_v4();
    body.app_id = app_id;
    let table = body.clone().into_active_model();
    let result = table.insert(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(result))
}

/// update_action - this will create new Application in Orca
async fn update_action(path: Path<(Uuid, Uuid, Uuid)>, body: web::Json<action::Model>) -> Result<HttpResponse, OrcaError> {
    let (_, _, action_id) = path.into_inner();
    let action = action::Entity::find_by_id(action_id).one(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    if let Some(_action) = action {
        let mut _action: action::ActiveModel = _action.into();
        _action.kind = Set(body.kind.to_owned());
        _action.description = Set(body.description.to_owned());
        _action.target_kind = Set(body.target_kind.to_owned());
        _action.target_value = Set(body.target_value.to_owned());
        _action.data_kind = Set(body.data_kind.to_owned());
        _action.data_value = Set(body.data_value.to_owned());
        _action.execution_order = Set(body.execution_order.to_owned());
        let _ = _action.save(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
        return Ok(HttpResponse::NoContent().finish());
    }
    Ok(HttpResponse::NoContent().finish())
}




/// delete_action - this will delete Action for Action Group in Application in Orca
async fn delete_action(path: Path<(Uuid, Uuid, Uuid)>) -> Result<HttpResponse, OrcaError> {
    let (_, _, action_id) = path.into_inner();
    let action_instance = action::Entity::find_by_id(action_id).one(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    if let Some(_action) = action_instance {
        let action_obj: action::ActiveModel = _action.into();
        let action_order = action_obj.clone().execution_order.unwrap();
        action_obj.delete(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
        let actions = action::Entity::find().filter(action::Column::ExecutionOrder.gt(action_order)).all(&CONFIG.get().await.db_client).await
            .expect("TODO: panic message");
        let actions: Vec<action::ActiveModel> = actions.into_iter().map(|mut x| {
            x.execution_order = x.execution_order + 1;
            x.into_active_model()
        }).collect();
        action::Entity::insert_many(actions).exec(&CONFIG.get().await.db_client).await
                .expect("TODO: panic message");
        return Ok(HttpResponse::NoContent().finish());
    }
    Ok(HttpResponse::NoContent().finish())
}


