import { Route, useHistory } from "react-router-dom";
import { lazily } from "react-lazily";
import { TopFrame } from "../../components/topframe";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Test Suit", href: "#", current: false }
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export const HOME_ROUTES = [
    {
        path: "",
        component: () => {
            const { HomeLayout } = lazily(() => import("../home"));
            return <HomeLayout />;
        },
    },
    {
        path: "/admin",
        component: () => {
            const { Adminpage } = lazily(() => import("../../admin"));
            return <Adminpage />;
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

export function AuthorizedLayout() {
  const history = useHistory();
  return (
    <div>
      <TopFrame navigation={HOME_ROUTES}/>
      <main>
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
      </main>
    </div>
  );
}
