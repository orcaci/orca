use thirtyfour::{By, WebDriver};
use cerium::error::CeriumResult;
use entity::action::{ActionGroup, ActionKind, ActionTarget, ATargetKind};
use serde_json::{Result, Value};


/// Controller
///     - Make sure the Object Construction Happen
///     - Correlation
///
/// // Driver Layer - Gets client as ref, Api Group
///

/// UIDriver is driver that will Handle all the
pub struct UIDriver<'uid> {
    pub(crate) client: &'uid WebDriver,
}

impl<'uid> UIDriver<'uid> {
    /// set_client Set the client object into the driver
    pub fn set_client(client: &WebDriver) {
    }
    /// default will create a new object to UI driver that will make
    /// the driver execute the command obj the W3C COMMAND
    pub fn default(client: &WebDriver) -> UIDriver {
        UIDriver{client}
    }

    pub fn match_action_type(&self, kind: &ActionKind){
        match kind {
            ActionKind::Click => {}
            ActionKind::Enter => {}
            ActionKind::DoubleClick => {}
        }
    }

    /// target - get the target object by
    fn target(&self, target: &ActionTarget) -> By {
        match &target.kind {
            ATargetKind::Css => By::Css(&target.value),
            ATargetKind::Id => By::Id(&target.value),
            ATargetKind::Xpath => By::XPath(&target.value)
        }
    }

    /// execute - will execute the command based on the Action object that is passed as args
    pub fn execute(&self, action_group: &ActionGroup) -> CeriumResult<()> {
        for action in &action_group.actions {
            let target = self.target(&action.target);

        }
        Ok(())
    }

}



#[cfg(test)]
mod tests {
    use serde_json::json;
    use thirtyfour::{DesiredCapabilities, WebDriver};
    use tokio::runtime::Runtime;
    use entity::action::{Action, ActionGroup};
    use crate::driver::ui::UIDriver;

    #[test]
    fn serialize_test() {
        let data = json!(
        [
          {
            "description": "Click on Submit",
            "type": "enter",
            "target": {
              "type": "css",
              "value": "#email"
            },
            "data": {
              "type": "static",
              "value": "mani@gmail.com"
            }
          },
          {
            "description": "Update user name",
            "type": "enter",
            "target": {
              "type": "id",
              "value": "password"
            },
            "data": {
              "type": "runtime",
              "value": "UserPWD"
            }
          },
          {
            "description": "login",
            "type": "enter",
            "target": {
              "type": "id",
              "value": "button"
            }
          }
        ]);
        let action: Vec<Action> = serde_json::from_value(data).expect("Panic from the Test case");
        let action_group = ActionGroup {
            actions: action,
            name: "Login testing for the automation".to_string(),
            description: None,
        };

        let mut caps = DesiredCapabilities::firefox();
        caps.set_headless().expect("TODO: panic message");

        let d = WebDriver::new("", caps);
        let driver = Runtime::new().unwrap().block_on(d).expect("TODO: panic message");
        let d = UIDriver::default(&driver);
        d.execute(&action_group).expect("TODO: panic message");

        println!("{:?}", action_group)
    }
}
