import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/sidebar";

export function SuitLayout() {
  // Reference URL - https://tailwind-elements.com/docs/standard/navigation/sidenav/
  return (
    <>
      <Sidebar />
      <div className={"flex-auto h-screen overflow-auto"}>
        <Outlet />
      </div>
    </>
  );
}
