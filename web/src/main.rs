pub mod components;
pub mod pages;
pub mod routes;

use yew::prelude::*;


#[function_component(App)]
fn app() -> Html {
    html! {
        <div>
            <routes.GlobalLayout></routes.GlobalLayout>
        </div>
    }
}

fn main() {
    yew::start_app::<App>();
}