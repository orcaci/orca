use actix_web::{Responder, web};

pub fn table_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/table")
            .route("/", web::get().to(get_tables))
            .route("/", web::post().to(get_tables))
            .route("/{id}", web::get().to(get_tables))
            .route("/{id}", web::delete().to(get_tables))
            .route("/{id}", web::put().to(get_tables))
            .route("/{id}/data/", web::post().to(get_tables))
            .route("/{id}/data/", web::get().to(get_tables))
            .route("/{id}/data/{data_id}", web::delete().to(get_tables))
    );
}

async fn get_tables() -> impl Responder {
    "THis is the response from the tables"
}

