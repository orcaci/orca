

// Remember: Owned props must implement `PartialEq`!
#[derive(PartialEq, Props)]
struct LikesProps {
    score: i32,
}

pub fn button(cx: Scope<LikesProps>) -> Element {
    cx.render(rsx! {
        div {
            "This post has ",
            b { "{cx.props.score}" },
            " likes"
        }
    })
}


