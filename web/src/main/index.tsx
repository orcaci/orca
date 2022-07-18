import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Route } from "react-router-dom";
// import { useHistory } from "react-router-dom";
import { HeatMapOutlined } from "@ant-design/icons";

import { HOME_ROUTES } from "../route";

import styles from "./main.module.css";

const { Sider } = Layout;

const TAB_MENU_OPTIONS = [
  {
    name: "Test suites",
    route: "/home",
    icon: <HeatMapOutlined />
  },
  {
    name: "User Management",
    route: "/admin",
    icon: <HeatMapOutlined />
  },
  {
    name: "Profiles",
    route: "/profiles",
    icon: <HeatMapOutlined />
  },
  {
    name: "DataTable",
    route: "/datatable",
    icon: <HeatMapOutlined />
  }
];

export function Mainpage() {
  const [isCollapsed, setCollapsed] = useState(false);
  // const history = useHistory();

  return (
    <Layout className={styles.homecontainer}>
      <Sider
        collapsible
        onCollapse={() => setCollapsed((state) => !state)}
        collapsed={isCollapsed}
      >
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          {TAB_MENU_OPTIONS.map((item, index) => {
            return (
              <Menu.Item
                key={index + 1}
                icon={item.icon}
                // onClick={() => history.push(item.route)}
              >
                {item.name}
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>
      <Layout>
        {/* <div className={styles.layoutcontainer}>
          {HOME_ROUTES.map((route) => {
            const Component = route.component();
            return (
              <Route path={`${route.path}`} key={route.path} element={<Component />} />
            );
          })}
        </div> */}
      </Layout>
    </Layout>
  );
}
