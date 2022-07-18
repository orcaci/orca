import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Skeleton } from "antd";

import { MAIN_ROUTES } from "./route";
import { TopFrame } from "./components/topframe";

import "antd/dist/antd.css";

function App() {
  return (
    <BrowserRouter>
      <TopFrame navigation={MAIN_ROUTES} />
      <main className="flex w-full">
        <Suspense fallback={<Skeleton active={true} />}>
          <Routes>
            {MAIN_ROUTES.map((route) => {
              const Component = route.component();
              return (
                <Route
                  path={route.path}
                  key={route.key}
                  element={<Component />}
                >
                  {route.nestedRoute
                    ? route.nestedRoute.map((route) => {
                        const Element = route.component();
                        return (
                          <Route
                            path={route.path}
                            key={route.path}
                            element={<Element />}
                          />
                        );
                      })
                    : null}
                </Route>
              );
            })}
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
}

export default App;
