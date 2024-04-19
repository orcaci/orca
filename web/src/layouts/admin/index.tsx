import { Outlet } from "react-router-dom";


export function AdminLayout() {
  return (
      <div className="layout-content">
        <Outlet />
      </div>
  );
}
