import { Route, Routes } from "react-router-dom";
import { lazily } from "react-lazily";
import { TopFrame } from "../../components/topframe";

export const HOME_ROUTES = [
  {
    path: "/suit/:id",
    component: () => {
      const { SuitLayout } = lazily(() => import("../suit"));
      return SuitLayout;
    },
    exact: false,
    key: "suit"
  }
];

export function AuthorizedLayout() {
  return (
    <div>
      <main>
        <div className="max-w-12xl">
          <Routes>
            {HOME_ROUTES.map((route: any) => {
              const Component = route.component();
              return (
                <Route
                  path={`${route.path}`}
                  key={route.key}
                  element={<Component />}
                />
              );
            })}
          </Routes>
        </div>
      </main>
    </div>
  );
}
