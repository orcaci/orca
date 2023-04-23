use env_logger::Builder;
use std::io::Write;
use env_logger::fmt::Color;
use log::LevelFilter;
use chrono::Local;

pub mod uuid;


/// init_logger - function will initialize log Handler for the application
pub fn init_logger() {
    Builder::new()
        .format(|buf, record| {
            let mut timestamp_style = buf.style();
            timestamp_style.set_color(Color::Magenta);

            let mut level_style = buf.style();
            level_style.set_color(Color::Red);
            writeln!(buf,
                "[{} {}] {} >>> {}",
                timestamp_style.value(Local::now().format("%d-%m-%Y %H:%M:%S")),
                level_style.value(record.level()),
                record.module_path_static().unwrap_or(""),
                record.args()
            )
        })
        .filter_level(LevelFilter::Debug)
        .init();
    // env_logger::init();
}