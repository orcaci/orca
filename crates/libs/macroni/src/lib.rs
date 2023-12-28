

use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(CustomModel)]
pub fn custom_model(input: TokenStream) -> TokenStream {
    // Parse the input into a Rust AST
    let input = parse_macro_input!(input as DeriveInput);

    // Generate new code based on the input AST
    let output = quote! {
        // Add a new field to the struct
        struct #input {
            pub my_field: u32,
            #input
        }

        // Add a new trait to the struct
        // impl #input {
        //     fn my_trait(&self) {
        //         // Trait implementation code goes here
        //     }
        // }
    };

    // Return the generated code as a TokenStream
    output.into()
}

#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    // Construct a representation of Rust code as a syntax tree
    // that we can manipulate
    let ast = syn::parse(input).unwrap();

    // Build the trait implementation
    impl_hello_macro(&ast)
}

fn impl_hello_macro(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    let gen = quote! {
        impl HelloMacro for #name {
            fn hello_macro() {
                println!("Hello, Macro! My name is {}!", stringify!(#name));
            }
        }
    };
    gen.into()
}

pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[derive(HelloMacro)]
    struct Hellow {
        pub message: string
    }

    #[test]
    fn it_works() {
        let a = Hellow{message:"hellow"};
        a.hello_macro();
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
