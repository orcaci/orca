use base::client::CLIENT;
use entity::test_step;
use sea_orm::{ConnectionTrait, Paginator, SelectorTrait};
use sea_orm::{query::*};
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use thirtyfour::{By, WebDriver};
use thirtyfour::prelude::WebDriverResult;


pub struct Step {
    pub driver: WebDriver,
    // pub steps: Paginator
}

impl Step {
    pub fn new(driver: WebDriver) -> Self {
        Self { driver }
    }
    async fn dispatch(self, fname: &str, step: test_step::ActiveModel) -> WebDriverResult<()> {
        match fname {
            "open" => self.event_click(step).await?,
            "click" => self.event_click(step).await?,
            "doubleClick" => self.event_click(step).await?,
            "select" => self.event_click(step).await?,
            "type" => self.event_click(step).await?,
            _ => unimplemented!(),
        };
        Ok(())
    }
    async fn event_click(self, step: test_step::ActiveModel) -> WebDriverResult<()> {
        let elem_button = self.driver.find_element(By::Css("button[type='submit']")).await?;
        elem_button.click().await?;
        Ok(())
    }
    pub async fn execute(step_id: i32) -> WebDriverResult<()> {
        let db = CLIENT.lock().unwrap().clone().database();
        let mut _steps = test_step::Entity::find()
            .filter(test_step::Column::TestCaseId.eq(step_id))
            .order_by_asc(test_step::Column::ExectionOrder).paginate(&db.conn, 50);
        // while let Some(steps) = _steps.fetch_and_next().await {
        //     for step in steps.iter() {
        //         // step.
        //     }
        // }
        Ok(())
    }
}


#[cfg(test)]
mod test_steps {
    #[test]
    fn create() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
