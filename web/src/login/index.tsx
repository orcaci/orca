import React from "react";
import { Input, Button } from "antd";

import styles from "./login.module.css";

export function LoginPage() {
  function onSubmitHandler() {}

  return (
    <div className={styles.logincontainer}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Identify yourself</h1>
        </div>
        <form onSubmit={onSubmitHandler}>
          <div className={styles.input}>
            <Input type="text" placeholder="Username" />
          </div>
          <div className={styles.input}>
            <Input type="password" placeholder="Password" />
          </div>
          <div className={styles.login}>
            <Button type="primary">Login</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
