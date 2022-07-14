import { lazily } from "react-lazily";
import { Route } from "react-router-dom";

export const HOME_ROUTES = [
    {
        path: "",
        component: () => {
            const { Homepage } = lazily(() => import("../../home"));
            return <Homepage />;
        },
    },
    {
        path: "/profiles",
        component: () => {
            const { ProfilePage } = lazily(() => import("../../profiles"));
            return <ProfilePage />;
        },
    },
    {
        path: "/datatable",
        component: () => {
            const { DataTable } = lazily(() => import("../../datatable"));
            return <DataTable />;
        }
    },
];

export function HomeLayout() {
    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {HOME_ROUTES.map((route: any) => {
            const Component = route.component;
            return (
              <Route path={`${route.path}`} key={route.path} exact={true}>
                <Component />
              </Route>
            );
          })}
        </div>
    );
}