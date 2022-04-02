pub use sea_orm;
pub mod prelude;
pub mod user;
pub mod user_group;
pub mod group;

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
