use yew::prelude::*;
use yew_router::prelude::{*, BrowserRouter};


#[derive(Routable, PartialEq, Clone, Debug)]
pub enum Route {
    // #[at("/posts/:id")]
    // Post { id: u64 },
    // #[at("/posts")]
    // Posts,
    // #[at("/authors/:id")]
    // Author { id: u64 },
    // #[at("/authors")]
    // Authors,
    #[at("/")]
    Home,
    #[not_found]
    #[at("/404")]
    NotFound,
}


// #[function_component(GlobalLayout)]
// pub fn global_layout() -> Html {
//     html! {
//         <div>
//             <BrowserRouter>
//                 <Switch<Route> render={Switch::render(switch)} />
//             </BrowserRouter>
//         </div>
//     }
// }


fn switch(routes: &Route) -> Html {
    match routes {
        Route::Home => html! { <h1>{ "Home" }</h1> },
        // Route::Secure => html! {
        //     <Secure />
        // },
        Route::NotFound => html! { <h1>{ "404" }</h1> },
    }
}

pub struct GlobalLayout;

impl Component for GlobalLayout {
    type Message = ();
    type Properties = ();

    fn create(ctx: &Context<Self>) -> Self {
        Self
    }

    fn view(&self, ctx: &Context<Self>) -> Html {
        html! {
            <div>
                <BrowserRouter>
                    <Switch<Route> render={Switch::render(switch)} />
                </BrowserRouter>
            </div>
        }
    }
}

