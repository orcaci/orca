import { Outlet } from "react-router-dom";
import { TopNav } from "core/components/topnav";

export function HomeLayout() {
  return (
    <>
      <TopNav />
      <div className="relative top-12 h-[calc(100vh_-_7vh)] p-3">
        <Outlet />
      </div>
    </>
  );
}
