use thirtyfour::{By, WebDriver};

use entity::prelude::target::ActionTargetKind;
use entity::test::ui::action::action::ActionKind;

// use entity::action::{ActionGroup, ActionKind, ActionTarget, ATargetKind};

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
            _ => {}
        }
    }

    /// target - get the target object by
    fn target(&self, target: &ActionTargetKind, value: &String) -> By {
        match &target {
            ActionTargetKind::Css => By::Css(value),
            ActionTargetKind::Id => By::Id(value),
            ActionTargetKind::Xpath => By::XPath(value)
        }
    }

}