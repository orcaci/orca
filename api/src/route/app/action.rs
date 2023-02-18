use actix_web::{HttpResponse, web};
use actix_web::web::Path;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, IntoActiveModel, ModelTrait, NotSet, QueryFilter, QueryOrder, Value};
use sea_orm::ActiveValue::Set;
use sea_orm::prelude::Uuid;

use cerium::error::web::OrcaError;
use entity::prelude::group;
use entity::test::ui::action::action;
use entity::test::ui::action::action::Model;

use crate::utils::config::CONFIG;

/// action_config - this will register all the endpoint in ACTION route
pub fn action_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/action")
            .route("/", web::get().to(get_action))
            .route("/", web::post().to(create_action))
            .route("/{group_id}", web::put().to(update_action))
            .route("/{group_id}", web::delete().to(delete_action))
    );

}


/// get_action - list all the Action Group in Specific Application in the Orca Application
async fn get_action(path: Path<(Uuid, Uuid)>) -> Result<HttpResponse, OrcaError> {
    let (_, group_id) = path.into_inner();
    let actions = action::Entity::find().filter(action::Column::ActionGroupId.eq(group_id))
        .order_by_asc(action::Column::ExecutionOrder).all(&CONFIG.get().await.db_client).await
        .expect("TODO: panic message");
    Ok(HttpResponse::Ok().json(actions))
}


/// create_action - this will create new Action Group in Application Application in Orca
async fn create_action(path: Path<(Uuid, Uuid)>, mut body: web::Json<action::Model>) -> Result<HttpResponse, OrcaError> {
    let (_, group_id) = path.into_inner();
    body.id = Uuid::new_v4();
    body.action_group_id = group_id;
    let app = body.clone().into_active_model();
    let result = app.insert(&CONFIG.get().await.db_client).await.expect("TODO: panic message");
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


