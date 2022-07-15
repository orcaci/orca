import { Route } from "react-router-dom";
import { lazily } from "react-lazily";
import { TopFrame } from "../../components/topframe";

export const HOME_ROUTES = [
    {
        path: "/",
        component: () => {
            const { HomeLayout } = lazily(() => import("../home"));
            return <HomeLayout />;
        },
        exact: true,
        key: "home"
    },
    {
        path: "/admin",
        component: () => {
            const { AdminLayout } = lazily(() => import("../admin"));
            return <AdminLayout />;
        },
        exact: false,
        key: "admin"
    },
    {
        path: "/suit/:id",
        component: () => {
            const { SuitLayout } = lazily(() => import("../suit"));
            return <SuitLayout />;
        },
        exact: false,
        key: "suit"
    }
];

export function AuthorizedLayout() {
  return (
    <div>
      <TopFrame navigation={HOME_ROUTES}/>
      <main>
        <div className="max-w-12xl">
          {HOME_ROUTES.map((route: any) => {
            const Component = route.component;
            return (
              <Route path={`${route.path}`} key={route.key} exact={route.exact}>
                <Component />
              </Route>
            );
          })}
        </div>
      </main>
    </div>
  );
}
