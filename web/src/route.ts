import React from "react";

export const MAIN_ROUTES = [
  {
    path: "/",
    component: React.lazy(() =>
      import("./main").then(({ Mainpage }) => ({ default: Mainpage }))
    )
  },
  {
    path: "/login",
    component: React.lazy(() =>
      import("./login").then(({ LoginPage }) => ({ default: LoginPage }))
    )
  }
];

export const HOME_ROUTES = [
  {
    path: "/home",
    component: React.lazy(() =>
      import("./page/home").then(({ Homepage }) => ({ default: Homepage }))
    )
  },
  {
    path: "/admin",
    component: React.lazy(() =>
      import("./page/admin").then(({ Adminpage }) => ({ default: Adminpage }))
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
    path: "/suite",
    component: React.lazy(() =>
      import("./test_suite").then(({ TestSuite }) => ({ default: TestSuite }))
    )
  }
];
