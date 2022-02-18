use actix::{Actor, StreamHandler};
use actix_web::{web, Error, HttpRequest, HttpResponse, Scope};
use actix_web_actors::ws;
use serde::{Deserialize, Serialize};

/// Define HTTP actor
struct Websocket;

#[derive(Serialize, Deserialize)]
struct RequestHandler {
    event: String,
}

impl Actor for Websocket {
    type Context = ws::WebsocketContext<Self>;
}

/// Handler for ws::Message message
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for Websocket {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Ping(_msg)) => ctx.pong("pong".as_ref()),
            Ok(ws::Message::Text(_text)) => ctx.text("detected text"),
            Ok(ws::Message::Binary(_bin)) => ctx.binary("detected Binary"),
            _ => (),
        }
    }
}

async fn index(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    let resp = ws::start(Websocket {}, &req, stream);
    println!("{:?}", resp);
    resp
}

/// register - this will register all the endpoint in admin route
pub fn register() -> Scope {
    web::scope("/ws").route("", web::get().to(index))
}
