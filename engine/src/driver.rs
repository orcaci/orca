use base::client::CLIENT;
use base::CONFIG;
use entity::test_step;
use serde_json::{json, Value};
use thirtyfour::{DesiredCapabilities, WebDriver};
use crate::step::Step;
use sea_orm::{query::*};
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;

#[derive(Debug)]
pub struct Driver{
    pub driver: WebDriver
}

impl Driver {
    pub async fn new(cap: Value) -> Driver {
        let _cap = DesiredCapabilities::new(cap);
        let _driver = WebDriver::new(&*CONFIG.selinum.hub.clone(), _cap).await;
        Self {
            driver: _driver.unwrap()
        }
    }
    pub async fn default() -> Driver {
        let cap = json!({
            "browserName": "chrome",
            "enableVideo": true
        });
        Self::new(cap).await
    }
    pub async fn execute(self, step_id: i32) -> Step {
        let db = CLIENT.lock().unwrap().clone().database();
        let mut _steps = test_step::Entity::find()
            .filter(test_step::Column::TestCaseId.eq(step_id))
            .order_by_asc(test_step::Column::ExectionOrder).paginate(&db.conn, 50);
        Step::new(self.driver, _steps).execute()
    }
}

// impl Clone for Driver {
//     fn clone(&self) -> Self {
//         *self
//     }
// }
