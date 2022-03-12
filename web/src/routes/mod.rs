
use yew::prelude::*;
use yew_router::prelude::*;



#[derive(Routable, PartialEq, Clone, Debug)]
pub enum GlobalRoute {
    #[at("/posts/:id")]
    Post { id: u64 },
    #[at("/posts")]
    Posts,
    #[at("/authors/:id")]
    Author { id: u64 },
    #[at("/authors")]
    Authors,
    #[at("/")]
    Home,
    #[not_found]
    #[at("/404")]
    NotFound,
}
