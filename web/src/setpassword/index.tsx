import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import styles from "./setpassword.module.css";
import Circle from "./icons/circle.svg";
import CirclePass from "./icons/circle.pass.svg";

const VALIDATE_AT_LEAST_EIGHT_CHARACTER_REGEX = /^(?=\S{8,}$).*$/;
const VALIDATE_BOTH_UPPERCASE_LOWERCASE_CHARACTER_REGEX =
  /^(?=(?:.*?[A-Z]))(?=.*?[a-z]).*$/;
const VALIDATE_AT_LEAST_ONE_NUMBER_OR_SYMBOL_REGEX =
  /^(?=.*[!@#$%^&*])(?=(?:.*?[0-9])).*$/;

export function SetPassword() {
  const [valiationRule, setValidationRule] = useState({
    AT_LEAST_EIGHT_CHARACTER: false,
    BOTH_UPPERCASE_LOWERCASE_CHARACTER: false,
    AT_LEAST_ONE_NUMBER_OR_SYMBOL: false
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const verifyPasswordCharacters = (value: string) => {
    const cloneObj = { ...valiationRule };
    cloneObj.AT_LEAST_EIGHT_CHARACTER =
      VALIDATE_AT_LEAST_EIGHT_CHARACTER_REGEX.test(value);
    cloneObj.BOTH_UPPERCASE_LOWERCASE_CHARACTER =
      VALIDATE_BOTH_UPPERCASE_LOWERCASE_CHARACTER_REGEX.test(value);
    cloneObj.AT_LEAST_ONE_NUMBER_OR_SYMBOL =
      VALIDATE_AT_LEAST_ONE_NUMBER_OR_SYMBOL_REGEX.test(value);
    setValidationRule(cloneObj);
  };

  return (
    <div className={styles.setpassword}>
      <Form layout="vertical">
        <h1>Create password</h1>
        <Form.Item name="newPassword">
          <Input
            type={"password"}
            placeholder="Enter your password"
            onChange={(e) => {
              setNewPassword(e.target.value);
              verifyPasswordCharacters(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item name="confirmnewPassword">
          <Input
            type={"password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </Form.Item>
        <div className={styles.resetPasswordValidationInfoBox}>
          <p className={styles.validationTitle}>Your Password must contains</p>
          <p className={styles.validationRuleTxt}>
            <img
              alt="8char"
              src={valiationRule.AT_LEAST_EIGHT_CHARACTER ? CirclePass : Circle}
            />
            At least 8 characters{" "}
          </p>{" "}
          <p className={styles.validationRuleTxt}>
            {
              <img
                alt="upperLowerCase"
                src={
                  valiationRule.BOTH_UPPERCASE_LOWERCASE_CHARACTER
                    ? CirclePass
                    : Circle
                }
              />
            }
            Both uppercase and lowercase characters{" "}
          </p>{" "}
          <p className={styles.validationRuleTxt}>
            {
              <img
                alt="numbersymbol"
                src={
                  valiationRule.AT_LEAST_ONE_NUMBER_OR_SYMBOL
                    ? CirclePass
                    : Circle
                }
              />
            }
            At least one number or symbol{" "}
          </p>{" "}
        </div>
        <div className={styles.footer}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !(
                newPassword === confirmNewPassword &&
                newPassword &&
                confirmNewPassword
              )
            }
          >
            Create password
          </Button>
        </div>
      </Form>
    </div>
  );
}
