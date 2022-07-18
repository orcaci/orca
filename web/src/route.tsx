import { lazily } from "react-lazily";
import { AcademicCapIcon, UserIcon } from "@heroicons/react/outline";

// function AuthorizedComponent(props: any) {
//   const { children } = props;
//   // const history = useHistory();
//   const isLoggedIn = localStorage.getItem("loggedIn") === "true";

//   if (isLoggedIn) {
//     return children;
//   } else {
//     // history.push("/login");
//     return null;
//   }
// }

export const MAIN_ROUTES = [
  {
    path: "/login",
    component: (): React.FunctionComponent => {
      const { Login } = lazily(() => import("./pages/auth/login"));
      return Login;
    },
    key: "login"
  },
  {
    path: "/setpassword",
    component: (): React.FunctionComponent => {
      const { ResetPassword } = lazily(
        () => import("./pages/auth/resetpassword")
      );
      return ResetPassword;
    },
    key: "setpassword"
  },
  {
    path: "/",
    component: () => {
      const { HomeLayout } = lazily(() => import("./layouts/home"));
      return HomeLayout;
    },
    key: "home"
  },
  {
    path: "/admin",
    component: () => {
      const { AdminLayout } = lazily(() => import("./layouts/admin"));
      return AdminLayout;
    },
    nestedRoute: [
      {
        path: "user",
        component: () => {
          const { UserManagement } = lazily(() => import("./pages/admin/user"));
          return UserManagement;
        },
        isMenu: true,
        name: "User Management",
        icon: UserIcon,
        relativePath: "/admin/user"
      },
      {
        path: "role",
        component: () => {
          const { DataTable } = lazily(() => import("./datatable"));
          return DataTable;
        },
        name: "Role Management",
        isMenu: true,
        icon: AcademicCapIcon,
        relativePath: "/admin/role"
      }
    ],
    key: "admin"
  },
  {
    path: "/suit",
    key: "suit",
    component: () => {
      const { SuitLayout } = lazily(() => import("./layouts/suit"));
      return SuitLayout;
    },
    nestedRoute: [
      {
        path: ":id/testcase",
        component: () => {
          const { TestCase } = lazily(() => import("./layouts/testcase"));
          return TestCase;
        },
        key: "testcase"
      },
      {
        path: ":id/datatable",
        component: () => {
          const { DataTable } = lazily(() => import("./pages/suit/datatable"));
          return DataTable;
        },
        key: "datatable"
      },
      {
        path: ":id/datatableold",
        component: () => {
          const { DataTable } = lazily(() => import("./datatable"));
          return DataTable;
        },
        key: "datatableold"
      },
      {
        path: ":id/stepgroup",
        component: () => {
          const { Step } = lazily(() => import("./layouts/step"));
          return Step;
        },
        key: "stepgroup"
      }
    ]
  }
];
// {
//   path: "*",
//   component: ():React.FunctionComponent => {
//     const { AuthorizedLayout } = lazily(() => import("./layouts/auth"));
//     return AuthorizedLayout
//   },
//   key: "authlayout"
// }

export const HOME_ROUTES = [
  // {
  //   path: "/home",
  //   component: ():React.FunctionComponent => {
  //     const { Homepage } = lazily(() => import("./home"));
  //     return Homepage;
  //   }
  // },
  // {
  //   path: "/admin",
  //   component: ():React.FunctionComponent => {
  //     const { Adminpage } = lazily(() => import("./admin"));
  //     return Adminpage;
  //   }
  // },
  // {
  //   path: "/profiles",
  //   component: ():React.FunctionComponent => {
  //     const { ProfilePage } = lazily(() => import("./profiles"));
  //     return ProfilePage;
  //   }
  // },
  // {
  //   path: "/datatable",
  //   component: ():React.FunctionComponent => {
  //     const { DataTable } = lazily(() => import("./datatable"));
  //     return DataTable;
  //   }
  // }
];
