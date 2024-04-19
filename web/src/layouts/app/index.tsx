import {
  BookOpenIcon,
  BriefcaseIcon,
  ChartPieIcon,
  DocumentCheckIcon,
  FunnelIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { Outlet, useNavigate, useParams, useMatch } from "react-router-dom";
import { routeStore } from "stores/route.store.js";

import "./index.css";

const menuItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: ChartPieIcon,
    isActive: true
  },
  {
    key: "actiongroup",
    label: "Action Group",
    icon: BriefcaseIcon
  },
  {
    key: "testsuite",
    label: "Test Suite",
    icon: RectangleGroupIcon
  },
  {
    key: "testcase",
    label: "Test Case",
    icon: FunnelIcon
  },
  // {
  //   key: "datatable",
  //   label: "Data table",
  //   icon: TableCellsIcon
  // },
  {
    key: "history",
    label: "Execution log",
    icon: DocumentCheckIcon
  },
  {
    key: "log",
    label: "log",
    icon: BookOpenIcon,
    children: [
      {
        key: "execution",
        label: "Exectution log",
        icon: BookOpenIcon
      },
      {
        key: "activity",
        label: "Activity log",
        icon: BookOpenIcon
      }
    ]
  }
];

export function AppLayout() {
  const navigate = useNavigate();

  const { appId } = useParams();
  const match = useMatch({ path: "/app/:appId/*" });
  
  const setActiveMenu = routeStore((state: any) => state.setAppActiveMenu);
  const activeMenu = routeStore((state: any) => state.appActiveMenu);
  const handleClick = (menu: string) => {
    setActiveMenu(menu);
    navigate(`${appId}/${menu}`);
  };

  useEffect(() => {
  const selectedRoute = match?.params["*"]?.split("/")[0] || "dashboard";
    setActiveMenu(selectedRoute);
  }, []);

  return (
    <>
      <aside
        id="logo-sidebar"
        className="fixed h-full w-0 top-0 start-0 sm:flex sm:w-60 sm:top-12 hidden left-0 pt-5 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full w-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {menuItems.map((menu: any) => {
              let cls = "flex-1 ml-3 whitespace-nowrap";
              let prCls =
                "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ";
              if (menu.key === activeMenu) {
                cls = cls + " text-indigo-600";
                prCls = prCls + " bg-gray-100";
              }
              return (
                <li key={menu.key}>
                  <div
                    // href="#"
                    onClick={() => handleClick(menu.key)}
                    className={prCls}
                  >
                    <menu.icon className="h-6 w-6 text-indigo-600" />
                    <span className={cls}>{menu.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
      <div className="relative p-0 m-0 w-full sm:w-[calc(100%_-_15rem)] sm:left-60 overflow-auto container">
        <Outlet />
      </div>
    </>
  );
}
