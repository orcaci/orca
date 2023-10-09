use log::info;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, ModelTrait, PaginatorTrait, QueryFilter, QueryOrder};
use sea_orm::prelude::Uuid;
use thirtyfour::By;

use entity::prelude::target::ActionTargetKind;
use entity::test::ui::action::action;
use entity::test::ui::action::action::ActionKind;

use crate::error::{EngineError, EngineResult};
use crate::server::driver::UIHelper;

pub struct ActionController<'ccl>{
    db: &'ccl DatabaseConnection,
    drive: &'ccl UIHelper
}

impl<'ccl> ActionController<'ccl> {
    /// new - this will create new Action Controller for the application
    pub fn new(db: &'ccl DatabaseConnection, drive: &'ccl UIHelper) -> ActionController<'ccl> {
        Self{db, drive}
    }
    
    async fn command_open(&self, action: &action::Model) -> EngineResult<()> {
        let a = match action.to_owned().data_value  {
            None => Err(EngineError::Forbidden),
            Some(url) => self.drive.open(url.as_str()).await
        };
        Ok(())
    }
    
    async fn command_enter(&self, action: &action::Model) -> EngineResult<()> {
        let data_value = action.to_owned().data_value
            .ok_or_else(|| EngineError::MissingParameter("action.data_value".to_string(), "".to_string()))?;
        let target_value = action.to_owned().target_value
            .ok_or_else(|| EngineError::MissingParameter("action.target_value".to_string(), "".to_string()))?;
        let target_kind = action.to_owned().target_kind
            .ok_or_else(|| EngineError::MissingParameter("action.target_kind".to_string(), "".to_string()))?;
        let by_kind = match target_kind {
            ActionTargetKind::Css => By::Css(target_value.as_str()),
            ActionTargetKind::Id => By::Id(target_value.as_str()),
            ActionTargetKind::Xpath => By::XPath(target_value.as_str())
        };
        self.drive.find(by_kind).await?.send_keys(data_value).await?;
        Ok(())
    }
    
    async fn command_click(&self, action: &action::Model) -> EngineResult<()> {
        let target_value = action.to_owned().target_value
            .ok_or_else(|| EngineError::MissingParameter("action.target_value".to_string(), "".to_string()))?;
        let target_kind = action.to_owned().target_kind
            .ok_or_else(|| EngineError::MissingParameter("action.target_kind".to_string(), "".to_string()))?;
        let by_kind = match target_kind {
            ActionTargetKind::Css => By::Css(target_value.as_str()),
            ActionTargetKind::Id => By::Id(target_value.as_str()),
            ActionTargetKind::Xpath => By::XPath(target_value.as_str())
        };
        self.drive.find(by_kind).await?.click().await?;
        Ok(())
    }
    
    async fn command_verify_text(&self, action: &action::Model) -> EngineResult<()> {
        let data_value = action.to_owned().data_value
            .ok_or_else(|| EngineError::MissingParameter("action.data_value".to_string(), "".to_string()))?;
        let target_value = action.to_owned().target_value
            .ok_or_else(|| EngineError::MissingParameter("action.target_value".to_string(), "".to_string()))?;
        let target_kind = action.to_owned().target_kind
            .ok_or_else(|| EngineError::MissingParameter("action.target_kind".to_string(), "".to_string()))?;
        let by_kind = match target_kind {
            ActionTargetKind::Css => By::Css(target_value.as_str()),
            ActionTargetKind::Id => By::Id(target_value.as_str()),
            ActionTargetKind::Xpath => By::XPath(target_value.as_str())
        };
        let text = self.drive.find(by_kind).await?.inner_html().await?;
        if text != data_value {
            info!("Verify text is failed {}", data_value);
            return Err(EngineError::MissingParameter("action.data_value".to_string(), data_value));
        }
        info!("Verify text is Success {}", data_value);
        Ok(())
    }
    
    pub async fn step_executor(&self, action: &action::Model) -> EngineResult<()> {
        let set_response = match action.kind { 
            ActionKind::Open => self.command_open(action).await?,
            ActionKind::Enter => self.command_enter(action).await?,
            ActionKind::Click => self.command_click(action).await?,
            ActionKind::DoubleClick => {},
            
            ActionKind::VerifyText =>  self.command_verify_text(action).await?,
            _ => {}
        };
        Ok(())
    }
    
    /// run_case - will execute the test case by the case ID
    pub async fn execute(&self, id: Uuid) -> EngineResult<()> {
        info!("Starting processing {action_id}", action_id=id);
        let mut action_page = action::Entity::find()
            .filter(action::Column::ActionGroupId.eq(id))
            .order_by_asc(action::Column::ExecutionOrder).paginate(self.db, 50);
        while let Some(actions) = action_page.fetch_and_next().await
            .map_err(EngineError::DatabaseError)? {
            for action in actions.into_iter() {
                info!("Executing step == [id] {:?}, [desc] {:?}", action.id, action.description);
                self.step_executor(&action).await?;
            }
        }
        Ok(())
    }
    
}

