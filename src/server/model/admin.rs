#[derive(Queryable)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub age: i32,
}

#[derive(Queryable)]
pub struct Group {
    pub id: i32,
    pub name: String,
    pub description: String,
}
