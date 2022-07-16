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
        <div>
          <h1>Test Suite page coming soon</h1>
        </div>
      );
}