import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/sidebar";

export function SuitLayout() {
  // const id = useParams();
  // const history = useHistory();
  // Reference URL - https://tailwind-elements.com/docs/standard/navigation/sidenav/
  return (
    <>
      <Sidebar />
      <div className="block">
        <div className="flex flex-1 items-center">Welcome to Test Suit</div>
        <Outlet />
      </div>
    </>
  );
}
