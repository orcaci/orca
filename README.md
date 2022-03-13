# 🐠 [Orca](https://orca.workfoxes.in)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2d958b72ca3b4bf89d5468b039b5a9ed)](https://app.codacy.com/gh/workfoxes/orca?utm_source=github.com&utm_medium=referral&utm_content=workfoxes/orca&utm_campaign=Badge_Grade_Settings)
[![MIT OR Apache-2.0](https://img.shields.io/crates/l/orca)](https://github.com/workfoxes/orca/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/workfoxes/orca/branch/master/graph/badge.svg)](https://codecov.io/gh/workfoxes/orca)

Orca - is test automation application that will help application automation with the Record and Playback. [Chromium](https://www.chromium.org/Home), [Firefox](https://www.mozilla.org/en-US/firefox/new/) and [WebKit](https://webkit.org/) built on top of Node.js library.

## Async runtimes
* [tokio](https://crates.io/crates/tokio)
* [actix-rt](https://crates.io/crates/actix-rt)
* [async-std](https://crates.io/crates/async-std)

These runtimes have passed tests. You can disable tokio, the default feature, and then choose another.

## Incompatibility
Functions do not have default arguments in rust.
Functions with two or more optional arguments are now passed with the builder pattern.

## Browser automation in rust
- [atroche/rust-headless-chrome](https://github.com/atroche/rust-headless-chrome)
- [saresend/selenium-rs](https://github.com/saresend/selenium-rs)
- [https://crates.io/crates/webdriver](https://crates.io/crates/webdriver)
- [mattsse/chromiumoxide](https://github.com/mattsse/chromiumoxide)
