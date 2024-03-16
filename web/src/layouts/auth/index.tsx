import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="layout-content auth-layout">
      <Outlet />
    </div>
  );
}
