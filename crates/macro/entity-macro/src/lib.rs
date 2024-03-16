// pub mod model;

extern crate proc_macro;
use proc_macro::TokenStream;

// use syn::{parse_macro_input, DeriveInput};
use quote::quote;
use syn::{DeriveInput, parse_macro_input};


/// Example of user-defined [derive mode macro][1]
///
/// [1]: https://doc.rust-lang.org/reference/procedural-macros.html#derive-mode-macros
#[proc_macro_derive(MyDerive)]
pub fn my_derive(input: TokenStream) -> TokenStream {
    eprintln!("input : {:#?}", input);
    // Parse the input tokens into a syntax tree
    let input = parse_macro_input!(input as DeriveInput);

    // Extract the name of the struct
    let struct_name = &input.ident;

    // Generate the new field to be added
    let new_field = quote! {
        new_field: i32,
    };

    eprintln!("marco input : {:#?}", input);

    // Generate the implementation of the trait for the struct
    let expanded = quote! {
        pub struct #struct_name {
            #new_field
        }
    };
    eprintln!("expanded: {:#?}", expanded);
    //
    // // Return the generated implementation as a TokenStream
    expanded.into()
    // let tokens = quote! {
    //     struct Hello;
    // };
    // tokens.into()
}

// /// Example of user-defined [procedural macro attribute][1].
// ///
// /// [1]: https://doc.rust-lang.org/reference/procedural-macros.html#attribute-macros
// #[proc_macro_attribute]
// pub fn my_attribute(_args: TokenStream, input: TokenStream) -> TokenStream {
//     let input = parse_macro_input!(input as DeriveInput);
//
//     let tokens = quote! {
//         #input
//
//         struct Hello;
//     };
//
//     tokens.into()
// }
//
//
// #[proc_macro_derive(AnswerFn)]
// pub fn derive_answer_fn(_item: TokenStream) -> TokenStream {
//     "fn answer() -> u32 { 42 }".parse().unwrap()
// }
//
