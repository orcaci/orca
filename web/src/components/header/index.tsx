import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Layout, Avatar, Dropdown, Menu } from "antd";

import styles from "./header.module.css";

const { Header } = Layout;

export function HeaderBar() {
  const history = useHistory();
  return (
    <Header className={styles.headercontainer}>
      <div className={styles.logo}>
        <span>Orca</span>
      </div>
      <div className={styles.rightlayout}>
        <div className={styles.admin} onClick={() => history.push("/admin")}>
          Admin
        </div>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>Logout</Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Avatar className={styles.avatar} size="large" gap={4}>
            User
          </Avatar>
        </Dropdown>
      </div>
    </Header>
  );
}
