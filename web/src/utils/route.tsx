import { lazily } from "react-lazily";

/**
 * ROUTES - will have all the route config in orca web app
 */
export const ROUTES = [
  {
    key: "authenticated",
    path: "",
    component: () => {
      const { HomeLayout } = lazily(() => import("layouts/home/index"));
      return HomeLayout;
    },
    nestedRoute: [
      {
        key: "admin",
        path: "/admin",
        component: () => {
          const { AdminLayout } = lazily(() => import("layouts/admin"));
          return AdminLayout;
        },
        nestedRoute: [
          //   {
          //     path: "usermanagement",
          //     component: () => {
          //       const { UserManagement } = lazily(
          //         () => import("../pages/admin/user")
          //       );
          //       return UserManagement;
          //     }
          //   },
          //   {
          //     path: "rolemanagement",
          //     component: () => {
          //       const { RoleManagement } = lazily(
          //         () => import("../pages/admin/role")
          //       );
          //       return RoleManagement;
          //     }
          //   }
        ]
      },
      {
        path: "/app",
        component: () => {
          const { AppLayout } = lazily(() => import("layouts/app"));
          return AppLayout;
        },
        nestedRoute: [
          {
            path: ":appId",
            component: () => {
              const { AppDashboard } = lazily(
                () => import("pages/app/dashboard")
              );
              return AppDashboard;
            }
          },
          {
            path: ":appId/dashboard",
            component: () => {
              const { AppDashboard } = lazily(
                () => import("pages/app/dashboard")
              );
              return AppDashboard;
            }
          },
          {
            path: ":appId/testsuite",
            component: () => {
              const { TestSuiteDashboard } = lazily(
                () => import("../pages/app/test_suite")
              );
              return TestSuiteDashboard;
            }
          },
          {
            path: ":appId/testsuite/:testSuiteId",
            component: () => {
              const { TestSuitePage } = lazily(
                () => import("../pages/app/test_suite/testsuite")
              );
              return TestSuitePage;
            }
          },
          {
            path: ":appId/actiongroup",
            component: () => {
              const { ActionGroupDashboard } = lazily(
                () => import("pages/app/action_group")
              );
              return ActionGroupDashboard;
            }
          },
          {
            path: ":appId/actiongroup/:actionGroupId",
            component: () => {
              const { ActionGroup } = lazily(
                () => import("pages/app/action_group/item")
              );
              return ActionGroup;
            }
          },
          {
            path: ":appId/testcase",
            component: () => {
              const { TestCaseDashboard } = lazily(
                () => import("../pages/app/test_case")
              );
              return TestCaseDashboard;
            }
          },
          {
            path: ":appId/testcase/:testCaseId",
            component: () => {
              const { TestCasePage } = lazily(
                () => import("../pages/app/test_case/testcase")
              );
              return TestCasePage;
            }
          },
          // {
          //   path: ":appId/datatable",
          //   component: () => {
          //     const { Datatable } = lazily(
          //       () => import("../pages/app/datatable")
          //     );
          //     return Datatable;
          //   }
          // },
          // {
          //   path: ":appId/datatable/:datatableId",
          //   component: () => {
          //     const { DatatableView } = lazily(
          //       () => import("../pages/app/datatable/view")
          //     );
          //     return DatatableView;
          //   }
          // },
          {
            path: ":appId/history/*",
            component: () => {
              const { History } = lazily(() => import("pages/app/history"));
              return History;
            }
          }
        ]
      },
      {
        path: "/",
        component: () => {
          const { Home } = lazily(() => import("../pages/home"));
          return Home;
        },
        nestedRoute: []
      }
    ]
  },
  {
    key: "public",
    path: "/auth",
    component: () => {
      const { AuthLayout } = lazily(() => import("layouts/auth"));
      return AuthLayout;
    },
    nestedRoute: [
      {
        path: "login",
        component: () => {
          const { Login } = lazily(() => import("pages/auth/login"));
          return Login;
        }
      }
    ]
  }
];
