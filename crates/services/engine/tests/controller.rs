



#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use log::info;
    use sea_orm::Database;
    use sea_orm::prelude::Uuid;

    use cerium::utils::init_logger;
    use engine::controller::case::CaseController;
    use engine::server::driver::UIHelper;

    #[tokio::test]
    async fn dry_run_test_controller() {
        init_logger();
        let case_id = "cd4ecfdd-628e-4288-b2a7-2eab2827673a".to_string();

        let uri = Some("postgres://root:root@localhost:5432/orca".to_string());

        let db = Database::connect(uri.unwrap()).await.expect("Error unable to connect DB");
        info!("got the db");
        let ui_driver = UIHelper::default().await.expect("error");
        info!("got the driver");
        let controller = CaseController::new(&db, &ui_driver);
        info!("got the controller");
        controller.run_case(Uuid::from_str(case_id.as_str()).expect("")).await.expect("error");
        ui_driver.driver.quit().await;
    }

    // #[test]
    // fn serialize_test() {
    //     let data = json!(
    //     [
    //       {
    //         "description": "Click on Submit",
    //         "type": "enter",
    //         "target": {
    //           "type": "id",
    //           "value": "email"
    //         },
    //         "data": {
    //           "type": "static",
    //           "value": "mani@gmail.com"
    //         }
    //       },
    //       {
    //         "description": "Update user name",
    //         "type": "enter",
    //         "target": {
    //           "type": "id",
    //           "value": "password"
    //         },
    //         "data": {
    //           "type": "runtime",
    //           "value": "UserPWD"
    //         }
    //       },
    //       {
    //         "description": "login",
    //         "type": "click",
    //         "target": {
    //           "type": "id",
    //           "value": "button"
    //         }
    //       }
    //     ]);
    //     let action: Vec<Action> = serde_json::from_value(data).expect("Panic from the Test case");
    //     let action_group = ActionGroup {
    //         actions: action,
    //         name: "Login testing for the automation".to_string(),
    //         description: None,
    //     };
    //
    //     let mut caps = DesiredCapabilities::firefox();
    //     caps.set_headless().expect("TODO: panic message");
    //
    //     let d = WebDriver::new("https://localhost:4444//wd/hub/session", caps);
    //     let driver = Runtime::new().unwrap().block_on(d).expect("TODO: panic message");
    //     let d = UIDriver::default(&driver);
    //     d.execute(&action_group).expect("TODO: panic message");
    //
    //     println!("{:?}", action_group)
    // }
}
