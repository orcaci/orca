import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Skeleton } from "antd";

import { MAIN_ROUTES } from "./route";

import "antd/dist/antd.css";
import { TopFrame } from "./components/topframe";

function App() {
  return (
    <BrowserRouter>
      <TopFrame navigation={MAIN_ROUTES}/>

      <Suspense fallback={<Skeleton active={true} />}>
        <Routes>
          {MAIN_ROUTES.map((route) => {
            const Component = route.component();
            return (
              <Route path={route.path} key={route.key} element={<Component />} >
                {route.nestedRoute ? route.nestedRoute.map(route => {
                  let Element = route.component()
                  return <Route path={route.path} key={route.path} element={<Element />} />
                }) : null}
              </Route>
              );
            })}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
