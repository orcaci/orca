import React, { Suspense } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { Skeleton } from "antd";

import { HeaderBar } from "./components/header";

import { MAIN_ROUTES } from "./route";

import "antd/dist/antd.css";

function App() {
  return (
    <BrowserRouter basename="/view">
      <HeaderBar />
      {MAIN_ROUTES.map((route) => {
        const Component = route.component;
        return (
          <Suspense fallback={<Skeleton active={true} />}>
            <Route path={route.path} key={route.path}>
              <Component />
            </Route>
          </Suspense>
        );
      })}
      <Redirect to="/home" />
    </BrowserRouter>
  );
}

export default App;
