use thirtyfour::WebDriver as TFWebDriver;

use crate::error::CeriumResult;
use thirtyfour::{By, DesiredCapabilities, WebElement};

#[derive(Clone)]
pub struct WebDriver {
    pub driver: TFWebDriver,
}

impl WebDriver {
    /// new - will create new Helper object with the EngineResult Wrap around it
    ///
    /// # Example
    /// ```no_run
    /// use thirtyfour::{WebDriver as WD};
    /// use cerium::error::CeriumResult;
    ///     use cerium::client::driver::web::WebDriver;
    ///
    /// fn main() -> CeriumResult<()> {
    ///     let _driver = WD::default();
    ///     let driver = WebDriver::new(_driver)?;
    /// }
    /// ```
    ///
    /// **NOTE:** If the webdriver appears to hang or give no response, please check that the
    ///     capabilities object is of the correct type for that webdriver.
    pub fn new(driver: TFWebDriver) -> CeriumResult<Self> {
        let helper = WebDriver { driver };
        Ok(helper)
    }

    pub async fn default() -> CeriumResult<Self> {
        let caps = DesiredCapabilities::firefox();
        let driver = TFWebDriver::new("http://localhost:4444/wd/hub/session", caps).await?;
        Self::new(driver)
    }

    pub async fn open(&self, url: &str) -> CeriumResult<()> {
        Ok(self.driver.goto(url).await?)
    }

    pub async fn create_window(&self, name: &str) -> CeriumResult<()> {
        let win_handler = self.driver.new_window().await?;
        self.driver.switch_to_window(win_handler).await?;
        self.driver.set_window_name(name).await?;
        Ok(())
    }

    pub async fn find(&self, by: impl Into<By>) -> CeriumResult<WebElement> {
        Ok(self.driver.find(by).await?)
    }

    /// take_screenshot - will take screenshot and send png back to the requester
    pub async fn take_screenshot(&self) -> CeriumResult<Vec<u8>> {
        Ok(self.driver.screenshot_as_png().await?)
    }
}
