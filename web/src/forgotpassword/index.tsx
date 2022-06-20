import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import styles from "./forgotpassword.module.css";
import { Link } from "react-router-dom";

export function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <div className={styles.forgotpassword}>
      <Form layout="vertical">
        <h1>Forgot password</h1>
        <p>
          We will send you an email with instructions to reset your password
        </p>
        <Form.Item name="email">
          <Input
            autoComplete="off"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <div className={styles.footer}>
          <Link to="/login">Go back to sign in</Link>
          <Button type="primary" disabled={!email}>
            Send email
          </Button>
        </div>
      </Form>
    </div>
  );
}
