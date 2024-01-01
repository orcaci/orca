use sea_orm::{ActiveModelBehavior, ActiveModelTrait};

pub trait OrcaModel: ActiveModelBehavior {
    fn new() -> Self {
        <Self as ActiveModelTrait>::default()
    }
}
