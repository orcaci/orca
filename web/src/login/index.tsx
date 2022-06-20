import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import styles from "./login.module.css";
import { Link, useHistory } from "react-router-dom";

export function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onFinish = async (values: { username: string; password: string }) => {
    try {
      values.password = btoa(values.password);
      localStorage.setItem("loggedIn", "true");
      history.push("/home");
      // const result = await axios.post("/api/user/login", values);
      // console.log(result.data);
      // if (!result.data.success) {
      //   message.error("Login failed");
      // } else {
      //   localStorage.setItem("loggedIn", "true");
      //   import("../main").then(({ Mainpage }) => ({
      //     default: Mainpage
      //   }));
      //   // message.success("Login successfull");
      // }
    } catch (error) {
      message.error(`Login failed! Error: ${error}`);
    }
  };
  return (
    <div className={styles.login}>
      <Form layout="vertical" onFinish={onFinish}>
        <h1>Login</h1>
        <Form.Item name="email" label="Email" required>
          <Input
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item name="password" label="Password" required>
          <Input
            type={"password"}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <div className={styles.footer}>
          <Link to="/forgotpassword">Forgot Password</Link>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!(email && password)}
          >
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
}
