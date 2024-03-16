
// use futures::StreamExt;
//
// use chromiumoxide::browser::{Browser, BrowserConfig};
//
// #[async_std::main]
// async fn main() -> Result<(), Box<dyn std::error::Error>> {
//
//     // create a `Browser` that spawns a `chromium` process running with UI (`with_head()`, headless is default)
//     // and the handler that drives the websocket etc.
//     let (mut browser, mut handler) =
//         Browser::launch(BrowserConfig::builder().with_head().build()?).await?;
//
//     // spawn a new task that continuously polls the handler
//     let handle = async_std::task::spawn(async move {
//         while let Some(h) = handler.next().await {
//             if h.is_err() {
//                 break;
//             }
//         }
//     });
//
//     // create a new browser page and navigate to the url
//     let page = browser.new_page("https://en.wikipedia.org").await?;
//
//     // find the search bar type into the search field and hit `Enter`,
//     // this triggers a new navigation to the search result page
//     page.find_element("input#searchInput")
//         .await?
//         .click()
//         .await?
//         .type_str("Rust programming language")
//         .await?
//         .press_key("Enter")
//         .await?;
//
//     let html = page.wait_for_navigation().await?.content().await?;
//     println!("{}", html);
//
//     browser.close().await?;
//     handle.await;
//     Ok(())
// }

use std::error::Error;

use headless_chrome::Browser;
use headless_chrome::protocol::cdp::Page;

// fn browse_wikipedia() -> Result<(), Box<dyn Error>> {

#[async_std::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let browser = Browser::default()?;

    let tab = browser.new_tab()?;

    /// Navigate to wikipedia
    tab.navigate_to("https://www.wikipedia.org")?;

    /// Wait for network/javascript/dom to make the search-box available
    /// and click it.
    tab.wait_for_element("input#searchInput")?.click()?;

    /// Type in a query and press `Enter`
    tab.type_str("WebKit")?.press_key("Enter")?;

    /// We should end up on the WebKit-page once navigated
    let elem = tab.wait_for_element("#firstHeading")?;
    assert!(tab.get_url().ends_with("WebKit"));

    /// Take a screenshot of the entire browser window
    let _jpeg_data = tab.capture_screenshot(
        Page::CaptureScreenshotFormatOption::Jpeg,
        None,
        None,
        true)?;

    /// Take a screenshot of just the WebKit-Infobox
    let _png_data = tab
        .wait_for_element("#mw-content-text > div > table.infobox.vevent")?
        .capture_screenshot(Page::CaptureScreenshotFormatOption::Png)?;

    // Run JavaScript in the page
    let remote_object = elem.call_js_fn(r#"
        function getIdTwice () {
            // `this` is always the element that you called `call_js_fn` on
            const id = this.id;
            return id + id;
        }
    "#, vec![], false)?;
    match remote_object.value {
        Some(returned_string) => {
            dbg!(&returned_string);
            assert_eq!(returned_string, "firstHeadingfirstHeading".to_string());
        }
        _ => unreachable!()
    };

    Ok(())
}