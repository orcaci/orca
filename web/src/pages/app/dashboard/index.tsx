import React from "react";
import { ExecutionHistory } from "../history/historys";

export function AppDashboard() {
  return (
    <div className="mb-4 py-4 grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="col-span-2">
        <ExecutionHistory></ExecutionHistory>{" "}
      </div>
    </div>
  );
}
