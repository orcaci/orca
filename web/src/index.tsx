// prettier-ignore
import React from 'react';
import ReactDOM from "react-dom/client";
// import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import "./index.css";

import "@radix-ui/themes/styles.css";
import reportWebVitals from "./reportWebVitals";
import { Theme } from "@radix-ui/themes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Theme accentColor="blue" appearance="light" radius="medium">
      {/* <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Theme
        accentColor="crimson"
        grayColor="sand"
        radius="large"
        scaling="95%"
      > */}
      {/* <ThemePanel /> */}
      <App />
    </Theme>
    {/* </ThemeProvider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
