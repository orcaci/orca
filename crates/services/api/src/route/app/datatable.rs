use axum::{Extension, Json, Router};
use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{get, post};
use sea_orm::prelude::Uuid;
use serde_json::{json, Value};

use entity::test::datatable::Model;
use entity::test::field::Model as FieldModel;

use crate::error::InternalResult;
use crate::server::session::OrcaSession;
use crate::service::app::datatable::{DatatableService, TableDataRequest};

/// datatable_route - this will register all the endpoint in Datatable route
pub(crate) fn datatable_route() -> Router {
    Router::new()
        .route("/", get(list_datatables).post(create_datatable))
        .nest(
            "/:table_id",
            Router::new()
                .route("/batch", post(update_value))
                .route("/data/batch", post(update_value).get(get_data))
                .route("/field", post(create_field))
                .route(
                    "/",
                    get(get_datatable).delete(delete_table).post(update_data),
                )
                .route("/field/:field_id", post(delete_field)),
        )
}

/// list_datatables - list all the DataTable in Specific Application
async fn list_datatables(
    Extension(session): Extension<OrcaSession>,
    Path((app_id)): Path<Uuid>,
) -> InternalResult<impl IntoResponse> {
    let result = DatatableService::new(session, app_id)
        .list_datatables()
        .await?;
    Ok(Json(result))
}

/// create_datatable - this will create new Datatable in Application
async fn create_datatable(
    Extension(session): Extension<OrcaSession>,
    Path(app_id): Path<Uuid>,
    Json(body): Json<Model>,
) -> InternalResult<impl IntoResponse> {
    let result = DatatableService::new(session, app_id)
        .create_datatable(body)
        .await?;
    Ok((StatusCode::CREATED, Json(result)))
}

/// get_datatable - Get the Basic Information for Datatable
async fn get_datatable(
    Extension(session): Extension<OrcaSession>,
    Path((app_id, table_id)): Path<(Uuid, i32)>,
) -> InternalResult<impl IntoResponse> {
    let result = DatatableService::new(session, app_id)
        .get_datatable_info(table_id)
        .await?;
    Ok(Json(result))
}

/// create_field - this will create field in Application
async fn create_field(
    Extension(session): Extension<OrcaSession>,
    Path((app_id, table_id)): Path<(Uuid, i32)>,
    Json(body): Json<FieldModel>,
) -> InternalResult<impl IntoResponse> {
    let result = DatatableService::new(session, app_id)
        .create_new_field(table_id, body)
        .await?;
    Ok((StatusCode::CREATED, Json(result)))
}

/// delete_field - this will delete field in Application
async fn delete_field(
    Extension(session): Extension<OrcaSession>,
    Path((app_id, table_id, field_id)): Path<(Uuid, i32, String)>,
) -> InternalResult<impl IntoResponse> {
    DatatableService::new(session, app_id)
        .drop_field(table_id, field_id)
        .await?;
    Ok((StatusCode::NO_CONTENT, Json(json!({"status": "success"}))))
}

/// update_value - batch update the data in Datatable in Application
async fn update_value(
    Extension(session): Extension<OrcaSession>,
    Path((app_id, table_id)): Path<(Uuid, i32)>,
    Json(body): Json<Vec<TableDataRequest>>,
) -> InternalResult<impl IntoResponse> {
    DatatableService::new(session, app_id)
        .batch_update_data(table_id, body)
        .await?;
    Ok(Json(json!({"status": "success"})))
}

/// get_data - get data for specify Datatable in Application
async fn get_data(
    Extension(session): Extension<OrcaSession>,
    Path((app_id, table_id)): Path<(Uuid, i32)>,
) -> InternalResult<impl IntoResponse> {
    let response = DatatableService::new(session, app_id)
        .get_data(table_id)
        .await?;
    Ok(Json(response))
}

/// update_data - update data for specify Datatable in Application
async fn update_data(
    Extension(session): Extension<OrcaSession>,
    Path((app_id, table_id)): Path<(Uuid, i32)>,
    Json(body): Json<Value>,
) -> InternalResult<impl IntoResponse> {
    let response = DatatableService::new(session, app_id)
        .update_data(table_id, body)
        .await?;
    Ok(Json(response))
}

/// update_data - update data for specify Datatable in Application
async fn delete_table(
    Extension(session): Extension<OrcaSession>,
    Path((app_id, table_id)): Path<(Uuid, i32)>,
) -> InternalResult<impl IntoResponse> {
    let response = DatatableService::new(session, app_id)
        .delete_table(table_id)
        .await?;
    Ok(Json(response))
}

/// update_table - update data for specify Datatable in Application
async fn update_table(
    Extension(session): Extension<OrcaSession>,
    Path((app_id, table_id)): Path<(Uuid, i32)>,
    Json(body): Json<Value>,
) -> InternalResult<impl IntoResponse> {
    let response = DatatableService::new(session, app_id)
        .delete_table(table_id)
        .await?;
    Ok(Json(response))
}
