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
      const { Login } = lazily(() => import("./login"));
      return <Login />;
    },
    exact: true
  },
  {
    path: "/forgotpassword",
    component: () => {
      const { ForgotPassword } = lazily(() => import("./forgotpassword"));
      return <ForgotPassword />;
    },
    exact: true
  },
  {
    path: "/setpassword",
    component: () => {
      const { SetPassword } = lazily(() => import("./setpassword"));
      return <SetPassword />;
    },
    exact: true
  },
  {
    path: "/",
    component: () => {
      const { Mainpage } = lazily(() => import("./main"));
      return (
        <AuthorizedComponent>
          <Mainpage />
        </AuthorizedComponent>
      );
    }
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
