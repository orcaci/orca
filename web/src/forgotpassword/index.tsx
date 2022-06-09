import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import "./forgotpassword.css";
import { Link } from "react-router-dom";

export function ForgotPassword() {
  const [email, setEmail] = useState("");

  const onFinish = async (values: { email: String }) => {
    console.log(values);
  };
  return (
    <div className="forgotpassword">
      <Form layout="vertical" onFinish={onFinish}>
        <h1>Forgot password</h1>
        {/* <hr /> */}
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
        <div className="footer">
          <Link to="/login">Go back to sign in</Link>
          <Button type="primary" htmlType="submit" disabled={!email}>
            Send email
          </Button>
        </div>
      </Form>
    </div>
  );
}
