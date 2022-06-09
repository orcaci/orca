import React from "react";
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
    component: React.lazy(() =>
      import("./login").then(({ Login }) => ({ default: Login }))
    ),
    exact: true
  },
  {
    path: "/forgotpassword",
    component: React.lazy(() =>
      import("./forgotpassword").then(({ ForgotPassword }) => ({ default: ForgotPassword }))
    ),
    exact: true
  },
  {
    path: "/setpassword",
    component: React.lazy(() =>
      import("./setpassword").then(({ SetPassword }) => ({ default: SetPassword }))
    ),
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
  },
];

export const HOME_ROUTES = [
  {
    path: "/home",
    component: React.lazy(() =>
      import("./home").then(({ Homepage }) => ({ default: Homepage }))
    )
  },
  {
    path: "/admin",
    component: React.lazy(() =>
      import("./admin").then(({ Adminpage }) => ({ default: Adminpage }))
    )
  },
  {
    path: "/profiles",
    component: React.lazy(() =>
      import("./profiles").then(({ ProfilePage }) => ({
        default: ProfilePage
      }))
    )
  },
  {
    path: "/datatable",
    component: React.lazy(() =>
      import("./datatable").then(({ DataTable }) => ({
        default: DataTable
      }))
    )
  }
];
