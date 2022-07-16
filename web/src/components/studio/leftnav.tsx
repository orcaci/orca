import React, { useState } from "react";
import {
  AcademicCapIcon,
  UserIcon,
  DotsVerticalIcon,
  ChevronLeftIcon,
  PlusIcon
} from "@heroicons/react/outline";
import { Route } from "react-router-dom";
import styles from "./studio.module.css";

const ADMIN_ROUTES = [
  {
    name: "Home",
    icon: UserIcon
  },
  {
    name: "Login",
    icon: AcademicCapIcon
  },
  {
    name: "Admin",
    icon: AcademicCapIcon
  }
];

export function Leftnav() {
  const history = [];
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className="flex h-screen">
      <div
        className={`${
          isExpanded ? styles.Sidebar : styles.collapsed
        } shadow-md bg-white`}
        id="sidenavSecExample"
      >
        <div>
          <ChevronLeftIcon
            className="h-4 w-4"
            aria-hidden="true"
            onClick={handleChange}
          />
        </div>
        <div className="mt-4 mb-4 px-4">
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Create test suite
          </button>
          <input
            placeholder="Search"
            className="mt-4 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
          />
        </div>
        <hr className="my-2" />
        <ul className="relative px-1">
          {ADMIN_ROUTES.map((item: any, index: any) => {
            return (
              <li
                className="relative flex items-center ant-row-space-between"
                key={index}
              >
                <a
                  className="flex w-full space-x-4 items-center text-sm py-2 px-2 h-10 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-blue-600 hover:bg-blue-50 transition duration-300 ease-in-out"
                  onClick={() => {
                    history.push("/admin" + item.path);
                  }}
                  href="a"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="primary"
                >
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                  <span>{item.name}</span>
                </a>
                <DotsVerticalIcon className="h-4 w-4" aria-hidden="true" />
              </li>
            );
          })}
        </ul>
      </div>
      {/* <div className="h-full w-full shadow-md bg-white" id="admin-content">
        {ADMIN_ROUTES.map((route: any) => {
          const Component = route.component;
          return (
            <Route path={`${route.path}`} key={route.path} exact={true}>
              <Component />
            </Route>
          );
        })}
      </div> */}
    </div>
  );
}
