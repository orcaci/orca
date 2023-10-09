use thirtyfour::{By, DesiredCapabilities, WebDriver, WebElement};

use crate::error::{EngineError, EngineResult};

pub struct UIHelper {
    pub driver: WebDriver,
}

impl UIHelper {
    /// new - will create new Helper object with the EngineResult Wrap around it
    ///
    /// # Example
    /// ```no_run
    /// use engine::error::EngineResult;
    /// fn main() -> EngineResult<()> {
    ///     use engine::server::driver::UIHelper;
    ///     let driver = UIHelper::new()?;
    /// }
    /// ```
    ///
    /// **NOTE:** If the webdriver appears to hang or give no response, please check that the
    ///     capabilities object is of the correct type for that webdriver.
    pub fn new(driver: WebDriver) -> EngineResult<UIHelper> {
        let helper = UIHelper{driver};
        Ok(helper)
    }

    pub async fn default() -> EngineResult<UIHelper> {
        let caps = DesiredCapabilities::firefox();
        let driver = WebDriver::new("http://localhost:4444/wd/hub/session",
                                    caps).await.map_err(EngineError::WebdriverError)?;
        Self::new(driver)
    }
    

    pub async fn open(&self, url: &str) -> EngineResult<()> {
        self.driver.goto(url).await.map_err(EngineError::WebdriverError)
    }

    pub async fn create_window(&self, name: &str) -> EngineResult<()> {
        let win_handler = self.driver.new_window().await.map_err(EngineError::WebdriverError)?;
        self.driver.switch_to_window(win_handler).await.map_err(EngineError::WebdriverError)?;
        self.driver.set_window_name(name).await.map_err(EngineError::WebdriverError)?;
        Ok(())
    }

    pub async fn find(&self, by: impl Into<By>) -> EngineResult<WebElement> {
        self.driver.find(by).await.map_err(EngineError::WebdriverError)
    }


    /// take_screenshot - will take screenshot and send png back to the requester
    pub async fn take_screenshot(&self) -> EngineResult<Vec<u8>> {
        self.driver.screenshot_as_png().await.map_err(EngineError::WebdriverError)
    }
}
