use s3::Region;
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseTransaction, EntityTrait, IntoActiveModel, ModelTrait, PaginatorTrait, QueryFilter, QueryOrder, TryIntoModel};
use sea_orm::ActiveValue::Set;
use sea_orm::prelude::{DateTimeWithTimeZone, Uuid};
use thirtyfour::By;
use tracing::{error, info};

use cerium::client::Client;
use cerium::client::driver::web::WebDriver;
use cerium::client::storage::s3::S3Client;
use entity::prelude::ActiveItemLog;
use entity::prelude::target::ActionTargetKind;
use entity::test::ui::action::action;
use entity::test::ui::action::action::ActionKind;
use entity::test::ui::action::group::{Entity as ActionGroupEntity, Model as ActionGroupModel};
use entity::test::ui::ExecutionRequest;
use entity::test::ui::log::item_log::{ItemLogStatus, ItemLogType};
use entity::test::ui::log::ItemLog;

use crate::error::{EngineError, EngineResult};

pub struct ActionController<'ccl> {
    db: &'ccl DatabaseTransaction,
    driver: WebDriver,
    client: Client,
    storage_cli: S3Client,
}

impl<'ccl> ActionController<'ccl> {
    /// Constructs a new `ActionController` instance.
    ///
    /// # Arguments
    ///
    /// * `db` - A reference to a `DatabaseTransaction` instance.
    /// * `driver` - A `WebDriver` instance.
    /// * `client` - A `Client` instance.
    ///
    /// # Returns
    ///
    /// Returns a new `ActionController` instance.
    pub fn new(
        db: &'ccl DatabaseTransaction,
        driver: WebDriver,
        client: Client,
    ) -> ActionController<'ccl> {
        let storage_cli = client.storage_cli.clone();
        // Return a new ActionController instance
        Self {
            db,
            driver,
            client,
            storage_cli,
        }
    }

    /// Asynchronous method that handles the logic for executing the "Open" action in a test case.
    ///
    /// # Arguments
    ///
    /// * `self` - A reference to the `ActionController` struct.
    /// * `action` - A reference to an `action::Model` object representing the action to be executed.
    ///
    /// # Example
    ///
    /// ```rust
    /// use sea_orm::{DatabaseConnection, DatabaseTransaction};
    /// use cerium::client::driver::web::WebDriver;
    /// use engine::controller::action::ActionController;
    /// use entity::test::ui::action::action::Model;
    ///
    /// let db = DatabaseTransaction::new();
    /// let driver = WebDriver::default();
    /// let action = Model::new();
    /// let controller = ActionController::new(&db, driver);
    /// controller.command_open(&action).await;
    /// ```
    ///
    /// # Returns
    ///
    /// * `Result<(), EngineError>` - If the `data_value` field is `None`, it returns an `Err` with an `EngineError::Forbidden` variant. If the `data_value` field is not `None`, it opens the URL using the `drive` object and returns `Ok(())`.
    pub async fn command_open(&self, action: &action::Model) -> EngineResult<()> {
        let url = action.data_value.clone().ok_or_else(|| {
            EngineError::MissingParameter("url".to_string(), "".to_string())
        })?;
        info!("Opening URL: {}", url);
        self.driver.open(url.as_str()).await?;
        Ok(())
        // match action.data_value.clone() {
        //     Some(value) => Ok(self.driver.open(value.as_str()).await?),
        //     None => Err(EngineError::MissingParameter(
        //         "url".to_string(),
        //         "".to_string(),
        //     )),
        // }
    }

    /// Asynchronously enters data into a target element on a web page using a WebDriver.
    ///
    /// # Arguments
    ///
    /// * `action` - An `action::Model` object that contains the necessary information for the action, including the data value to be entered, the target value of the element, and the target kind (CSS, ID, or XPath).
    ///
    /// # Example
    ///
    /// ```rust
    /// use entity::prelude::target::ActionTargetKind;
    /// use entity::test::ui::action::action;
    /// use entity::test::ui::action::action::ActionKind;
    ///
    /// let action = action::Model {
    ///     id: Default::default(),
    ///     execution_order: 1,description: None,
    ///     kind: ActionKind::Click,
    ///     data_kind: None,
    ///     data_value: Some("example data".to_string()),
    ///     target_value: Some("example target".to_string()),
    ///     action_group_id: Default::default(),data: None,target_kind: Some(ActionTargetKind::Css),
    /// target: None,};
    /// ui_helper.command_enter(&action).await;
    /// ```
    ///
    /// # Errors
    ///
    /// Returns an `EngineError` if any of the required parameters (`action.data_value`, `action.target_value`, `action.target_kind`) are missing.
    ///
    /// # Returns
    ///
    /// Returns `Ok(())` if the action of entering data into the target element is successful.
    async fn command_enter(&self, action: &action::Model) -> EngineResult<()> {
        let data_value = action.data_value.clone().ok_or_else(|| {
            EngineError::MissingParameter("action.data_value".to_string(), "".to_string())
        })?;
        let target_value = action.target_value.clone().ok_or_else(|| {
            EngineError::MissingParameter("action.target_value".to_string(), "".to_string())
        })?;
        let target_kind = action.target_kind.clone().ok_or_else(|| {
            EngineError::MissingParameter("action.target_kind".to_string(), "".to_string())
        })?;
        let by_kind = match target_kind {
            ActionTargetKind::Css => By::Css(target_value.as_str()),
            ActionTargetKind::Id => By::Id(target_value.as_str()),
            ActionTargetKind::Xpath => By::XPath(target_value.as_str()),
        };
        self.driver
            .find(by_kind)
            .await?
            .send_keys(data_value)
            .await?;
        Ok(())
    }

    /// Performs a click action on a web element based on the provided target value and target kind.
    ///
    /// # Arguments
    ///
    /// * `action` - An instance of the `action::Model` struct that contains the target value and target kind.
    ///
    /// # Example
    ///
    /// ```rust
    /// use entity::prelude::target::ActionTargetKind;
    /// use entity::test::ui::action::action;
    /// use entity::test::ui::action::action::ActionKind;
    /// let action = action::Model {
    ///     id: Default::default(),
    ///     execution_order: 0,description: None,kind: 
    ///     ActionKind::Click,data_kind: None,data_value: Some("button".to_string()),
    ///     target_kind: Some(ActionTargetKind::Css),
    ///     target_value: None,action_group_id: Default::default(),data: None,target: None,};
    ///
    /// ui_helper.command_click(&action);
    /// ```
    ///
    /// # Returns
    ///
    /// Returns `Ok(())` if the click action is performed successfully.
    async fn command_click(&self, action: &action::Model) -> EngineResult<()> {
        let target_value = action.target_value.clone().ok_or_else(|| {
            EngineError::MissingParameter(
                "command_click.action.target_value".to_string(),
                "".to_string(),
            )
        })?;
        let target_kind = action.target_kind.clone().ok_or_else(|| {
            EngineError::MissingParameter(
                "command_click.action.target_kind".to_string(),
                "".to_string(),
            )
        })?;
        let by_kind = match target_kind {
            ActionTargetKind::Css => By::Css(target_value.as_str()),
            ActionTargetKind::Id => By::Id(target_value.as_str()),
            ActionTargetKind::Xpath => By::XPath(target_value.as_str()),
        };
        self.driver.find(by_kind).await?.click().await?;
        Ok(())
    }

    async fn command_verify_text(&self, action: &action::Model) -> EngineResult<()> {
        let data_value = action.data_value.clone().ok_or_else(|| {
            EngineError::MissingParameter("action.data_value".to_string(), "".to_string())
        })?;
        let target_value = action.target_value.clone().ok_or_else(|| {
            EngineError::MissingParameter(
                "command_verify_text.action.target_value".to_string(),
                "".to_string(),
            )
        })?;
        let target_kind = action.target_kind.clone().ok_or_else(|| {
            EngineError::MissingParameter("action.target_kind".to_string(), "".to_string())
        })?;
        let by_kind = match target_kind {
            ActionTargetKind::Css => By::Css(target_value.as_str()),
            ActionTargetKind::Id => By::Id(target_value.as_str()),
            ActionTargetKind::Xpath => By::XPath(target_value.as_str()),
        };
        let we = self.driver.find(by_kind).await?;
        let text = we.inner_html().await?;
        info!(text);
        if text != data_value {
            info!("Verify text is failed {}", data_value);
            return Err(EngineError::MissingParameter(
                "action.data_value".to_string(),
                data_value,
            ));
        }
        info!("Verify text is Success {}", data_value);
        Ok(())
    }

    pub async fn step_executor(&self, action: &action::Model) -> EngineResult<()> {
        let set_response = match action.kind.clone() {
            ActionKind::Open => self.command_open(action).await?,
            ActionKind::Enter => self.command_enter(action).await?,
            ActionKind::Click => self.command_click(action).await?,
            ActionKind::DoubleClick => {}

            ActionKind::VerifyText => self.command_verify_text(action).await?,
            _ => {}
        };
        Ok(())
    }

    async fn take_screenshot(&self, id: String) -> EngineResult<()> {
        let session_id = self.driver.session_id().await?;
        let content = self.driver.take_screenshot().await?;
        let _result = self
            .storage_cli
            .create("orca", format!("session/{session_id}/{id}.png").as_str(), content.as_slice())
            .await?;
        Ok(())
    }

    pub async fn execute_action(&self, action: &action::Model, er: &ExecutionRequest,
                                log: &ItemLog) -> EngineResult<()> {
        // let log_id = log.map(|l| l.id);
        // let mut log_am = ActiveItemLog::new(er.id, Some(action.id), ItemLogType::Action,
        //                                     action.id, log_id).save(self.db).await?;
        info!("[{er}] Trigger Action {action_id}", er=er.ref_id, action_id = action.id);
        info!("Action {:#?}", action);
        // let start = chrono::Utc::now();
        self.step_executor(&action).await?;
        self.take_screenshot(action.id.to_string()).await?;
        info!(
            "Done step == [id] {:?}, [desc] {:?}",
            action.id, action.description
        );
        // log_am.execution_time = Set((chrono::Utc::now() - start).num_milliseconds() as i32);
        // log_am.status = Set(ItemLogStatus::Success);
        // log_am.finished_at = Set(chrono::Utc::now().into());
        // log_am.save(self.db).await?;
        Ok(())
    }

    pub async fn execute_action_group(&self, action_group: ActionGroupModel, er: &ExecutionRequest,
                                      log: Option<&ItemLog>) -> EngineResult<()> {
        let mut action_page = action::Entity::find()
            .filter(action::Column::ActionGroupId.eq(action_group.id))
            .order_by_asc(action::Column::ExecutionOrder)
            .paginate(self.db, 50);
        while let Some(actions) = action_page.fetch_and_next().await? {
            for action in actions.into_iter() {
                let start = chrono::Utc::now();
                let log_id = log.map(|l| l.id);
                let mut action_log = ActiveItemLog::new(er.id, Some(action.id.clone()),
                                                        ItemLogType::Action, action.id.clone(),
                                                        log_id).save(self.db).await?;
                let _log = action_log.clone().try_into_model()?;
                let result = self.execute_action(&action, er, &_log).await;
                action_log.execution_time = Set((chrono::Utc::now() - start).num_milliseconds() as i32);
                action_log.finished_at = Set(chrono::Utc::now().into());
                match result {
                    Ok(_) => {
                        action_log.status = Set(ItemLogStatus::Success);
                        action_log.save(self.db).await?;
                    }
                    Err(e) => {
                        error!("Error in Action: {:?}", e);
                        action_log.status = Set(ItemLogStatus::Failed);
                        action_log.save(self.db).await?;
                        return Err(e);
                    }
                }
            }
        }
        Ok(())
    }

    /// run_case - will execute the test case by the case ID
    pub async fn execute(&self, id: Uuid, er: &ExecutionRequest,
                         log: Option<&ItemLog>, ref_id: Option<Uuid>) -> EngineResult<()> {
        let start = chrono::Utc::now();
        let mut log_am = ActiveItemLog::new(er.id, ref_id, ItemLogType::ActionGroup, id, None).save(self.db).await?;
        info!("[{er}] Trigger Action {action_id}", er=er.ref_id, action_id = id);
        let action_group = ActionGroupEntity::find_by_id(id).one(self.db)
            .await?
            .ok_or(EngineError::MissingParameter("ActionGroup".to_string(), id.into()))?;
        if log.is_some() {
            log_am.log_id = Set(Some(log.unwrap().id));
        }
        let mut log_am = log_am.save(self.db).await?;
        let log = log_am.clone().try_into_model()?;
        self.execute_action_group(action_group, er, Some(&log)).await?;

        log_am.execution_time = Set((chrono::Utc::now() - start).num_milliseconds() as i32);
        log_am.status = Set(ItemLogStatus::Success);
        log_am.finished_at = Set(chrono::Utc::now().into());
        log_am.save(self.db).await?;
        Ok(())
    }
}
