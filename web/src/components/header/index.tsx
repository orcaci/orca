import { Layout, Avatar, Dropdown, Menu } from "antd";

import styles from "./header.module.css";

const { Header } = Layout;

export function HeaderBar() {
  return (
    <Header className={styles.headercontainer}>
      <div className={styles.logo}>
        <span>
          <strong>Orca</strong>
        </span>
      </div>
      <div className={styles.rightlayout}>
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
