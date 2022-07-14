import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Skeleton } from "antd";

import { HeaderBar } from "./components/header";

import { MAIN_ROUTES } from "./route";

import "antd/dist/antd.css";

function App() {
  return (
    <BrowserRouter basename="/view">
      {/* <HeaderBar /> */}
      <Suspense fallback={<Skeleton active={true} />}>
        <Switch>
          {MAIN_ROUTES.map((route) => {
            const Component = route.component;
            return (
              <Route path={route.path} exact={route.exact} key={route.key}>
                <Component />
              </Route>
            );
          })}
        </Switch>
      </Suspense>
      {/* <Redirect to="/home" /> */}
    </BrowserRouter>
  );
}

export default App;
