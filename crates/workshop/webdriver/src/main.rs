use tracing::info;

fn main() {
    // Initialize tracing subscriber for logging
    tracing_subscriber::fmt::init();
    
    info!("WebDriver workshop starting...");
}