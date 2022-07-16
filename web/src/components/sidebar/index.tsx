import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeftIcon,
  SearchIcon,
  FolderIcon,
  ChevronDownIcon,
  TrashIcon,
  PlusIcon
} from "@heroicons/react/outline";

export const Sidebar = () => {
  const location = useLocation();
  const secondParam = location.pathname.split("/");
  const { id } = useParams();
  const [open, setOpen] = useState(true);
  const [subMenuOpen, setSubMenuOpen] = useState(secondParam?.[3] || "");
  const [activeSubMenuItem, setActiveSubMenuItem] = useState(id);
  const navigate = useNavigate();

  const Menus = [
    {
      title: "Data table",
      key: "datatable",
      subMenu: true,
      subMenuItems: [
        { title: "Login mock", key: "login_mock" },
        { title: "Signup mock", key: "signup_mock" }
      ]
    },
    {
      title: "Test Case",
      key: "testcase",
      subMenu: true,
      subMenuItems: [
        { title: "Login", key: "login" },
        { title: "Signup", key: "signup" }
      ]
    },
    {
      title: "Step Group",
      key: "stepgroup",
      subMenu: true,
      subMenuItems: [
        { title: "Email", key: "email" },
        { title: "Password", key: "password" }
      ]
    }
  ];

  const onHandleMenu = (key: string, subMenuKey: string) => {
    setSubMenuOpen(subMenuOpen === key ? "" : key);

    navigate(`/suit/${subMenuKey}/${key}`);
  };

  const onHandleSubMenu = (key: string, subMenuKey: string) => {
    const _menu = key;
    setActiveSubMenuItem(subMenuKey);

    navigate(`/suit/${subMenuKey}/${_menu}`);
  };

  return (
    <div
      className={`h-screen ${
        open ? "w-72" : "w-20"
      } duration-300 bg-gray-800 shadow-md p-5 pt-8 relative`}
    >
      <ChevronLeftIcon
        className={`w-6 z-10 text-3xl ${
          !open && "rotate-180"
        } text-white rounded-full 
        bg-indigo-700 hover:bg-indigo-500 border-indigo-700 absolute -right-3 top-9 border cursor-pointer`}
        onClick={() => setOpen((prevOpen) => !prevOpen)}
      />

      {/* <div className="inline-flex">
          <FolderOpenIcon className="w-6 rounded cursor-pointer block float-left" />
          <h1
            className={`text-white duration-300 ${
              !open && "scale-0"
            } origin-left`}
          >
            Test Suite
          </h1>
        </div> */}

      <div
        className={`h-10 flex items-center mt-6 ${
          open ? "px-4" : "px-2.5"
        } py-2 rounded-md border border-white`}
      >
        <SearchIcon
          className={`w-5 h-5 text-white block float-left cursor-pointer  ${
            open && "mr-2"
          } `}
        />

        <input
          placeholder="Search"
          className={`text-base bg-transparent w-full ${
            !open && "hidden"
          } text-black focus:outline-none`}
        />
      </div>

      <ul className="pt-2">
        {Menus.map((menu, index) => (
          <>
            <li
              key={index}
              className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-indigo-500 hover:text-white rounded-md mt-2"
              onClick={() => onHandleMenu(menu.key, menu.subMenuItems[0].key)}
            >
              <span className="block float-left">
                <FolderIcon className="w-6" />
              </span>
              <span
                className={`text-base flex-1 duration-200 truncate ${
                  !open && "hidden"
                }`}
              >
                {menu.title}
              </span>
              {menu.subMenu && open && (
                <>
                  <PlusIcon className="w-5 cursor-pointer p-1 rounded-full hover:bg-green-700 hover:text-black" />

                  <ChevronDownIcon
                    className={`w-3 ${
                      subMenuOpen === menu.key && "rotate-180"
                    }`}
                  />
                </>
              )}
            </li>

            {menu.subMenu && subMenuOpen === menu.key && (
              <ul className="duration-600">
                {menu.subMenuItems.map((subMenuItem, index) => (
                  <li
                    key={index}
                    className={`text-gray-300 text-sm mb-2 ${
                      !open && "text-center"
                    } flex items-center gap-x-4 cursor-pointer p-2 ${
                      open && "px-5"
                    } hover:bg-indigo-500 hover:text-white rounded-md ${
                      activeSubMenuItem === subMenuItem.key &&
                      "bg-indigo-700 text-white"
                    }`}
                    onClick={() => onHandleSubMenu(menu.key, subMenuItem.key)}
                  >
                    <span className="w-full truncate">
                      {open
                        ? subMenuItem.title
                        : subMenuItem.title.slice(0, 1).toLocaleUpperCase()}
                    </span>
                    {open && (
                      <span className="w-3">
                        <TrashIcon />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        ))}
      </ul>
    </div>
  );
};
