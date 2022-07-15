import React from "react";
import { CommandNode } from "../components/node/step/command";
import styles from "./home.module.css";

export function Homepage() {
  return (
    <div className={`flex ${styles.container}`}>
      <h1>Test Suite page coming soon</h1>
      <CommandNode />
    </div>
  );
}
