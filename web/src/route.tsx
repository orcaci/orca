import { lazily } from "react-lazily";
import { useHistory } from "react-router-dom";

function AuthorizedComponent(props: any) {
  const { children } = props;
  const history = useHistory();
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  if (isLoggedIn) {
    return children;
  } else {
    history.push("/login");
    return null;
  }
}

export const MAIN_ROUTES = [
  {
    path: "/login",
    component: () => {
      const { Login } = lazily(() => import("./pages/auth/login"));
      return <Login />;
    },
    exact: true,
    key: "login"
  },
  {
    path: "/setpassword",
    component: () => {
      const { ResetPassword } = lazily(() => import("./pages/auth/resetpassword"));
      return <ResetPassword />;
    },
    exact: true,
    key: "setpassword"
  },
  {
    path: "/",
    component: () => {
      const { AuthorizedLayout } = lazily(() => import("./layouts/auth"));
      return (
        <AuthorizedComponent>
          <AuthorizedLayout />
        </AuthorizedComponent>
      );
    },
    key: "authlayout"
  }
];

export const HOME_ROUTES = [
  {
    path: "/home",
    component: () => {
      const { Homepage } = lazily(() => import("./home"));
      return <Homepage />;
    }
  },
  {
    path: "/admin",
    component: () => {
      const { Adminpage } = lazily(() => import("./admin"));
      return <Adminpage />;
    }
  },
  {
    path: "/profiles",
    component: () => {
      const { ProfilePage } = lazily(() => import("./profiles"));
      return <ProfilePage />;
    }
  },
  {
    path: "/datatable",
    component: () => {
      const { DataTable } = lazily(() => import("./datatable"));
      return <DataTable />;
    }
  }
];
