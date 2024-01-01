use actix_http::error;
use actix_web::{HttpResponse, web};
use actix_web::error::ErrorBadRequest;
use actix_web::web::Path;
use futures_util::StreamExt;
use sea_orm::prelude::Uuid;
use crate::error::OrcaError;

const MAX_SIZE: usize = 262_144; // max payload size is 256k

/// file_config - file config will have all the file management endpoint in the application
pub fn file_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/file")
            .route("/{attachment_id}/", web::get().to(get_file_with_attachment_id))
            .route("/", web::post().to(get_file_with_attachment_id))
    );

}


/// Returns a Response with File object the have been requested for
///
/// # Arguments
/// * `path` - Path object from the Actix Endpoint that will hold the Identifier from the Request
async fn get_file_with_attachment_id(path: Path<Uuid>) -> Result<HttpResponse, OrcaError> {
    let _attachment_id = path.into_inner();
    // let mut request_ctx = RequestContext::default();
    // let db = request_ctx.database();
    // let cases = app::Entity::find().order_by_asc(app::Column::Name).all(&CONFIG.get().await.db_client).await;
    // let response = match cases {
    //     Ok(_cases) => _cases,
    //     Err(error) => panic!("Error while inserting: {:?}", error),
    // };
    // Ok(HttpResponse::Ok().json(response))
    Ok(HttpResponse::from(HttpResponse::NoContent()))
}


/// Returns a Attachment Reference Object that will Hold the Attachment Information
///
/// # Arguments
/// * `payload` - payload is streaming content of an attachment
async fn upload_attachment(mut payload: web::Payload) -> Result<HttpResponse, OrcaError> {
    let mut body = web::BytesMut::new();
    while let Some(chunk) = payload.next().await {
        let chunk = chunk.expect("Error from the Chunk");
        // limit max size of in-memory payload
        if (body.len() + chunk.len()) > MAX_SIZE {
            // handle the error when the streaming content is overflow
        }
        body.extend_from_slice(&chunk);
    }

    // body is loaded, now we can deserialize serde-json
    // let obj = serde_json::from_slice::<MyObj>(&body)?;
    // Ok(HttpResponse::Ok().json(obj)) // <- send response

    // let _attachment_id = path.into_inner();
    // let mut request_ctx = RequestContext::default();
    // let db = request_ctx.database();
    // let cases = app::Entity::find().order_by_asc(app::Column::Name).all(&CONFIG.get().await.db_client).await;
    // let response = match cases {
    //     Ok(_cases) => _cases,
    //     Err(error) => panic!("Error while inserting: {:?}", error),
    // };
    // Ok(HttpResponse::Ok().json(response))
    Ok(HttpResponse::from(HttpResponse::NoContent()))
}


