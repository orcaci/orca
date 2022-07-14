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
        exact: true
    },
    {
        path: "/admin",
        component: () => {
            const { AdminLayout } = lazily(() => import("../admin"));
            return <AdminLayout />;
        },
        exact: false
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
              <Route path={`${route.path}`} key={route.path} exact={route.exact}>
                <Component />
              </Route>
            );
          })}
        </div>
      </main>
    </div>
  );
}
