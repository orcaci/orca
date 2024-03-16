// import { TagsOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { AcademicCapIcon, UserIcon } from "@heroicons/react/24/outline";
// import { Layout, Menu, MenuProps } from "antd";
// import { Content } from "antd/es/layout/layout";
// import Sider from "antd/es/layout/Sider";
import { lazily } from "react-lazily";
import { Outlet, useNavigate } from "react-router-dom";

export const ADMIN_ROUTES = [
  // {
  //   key: "userManagement",
  //   path: "user",
  //   component: () => {
  //     const { UserManagement } = lazily(() => import("pages/admin/user"));
  //     return UserManagement;
  //   },
  //   isMenu: true,
  //   name: "User Management",
  //   icon: UserIcon,
  //   relativePath: "/admin/user"
  // },
  // {
  //   key: "roleManagement",
  //   path: "role",
  //   component: () => {
  //     const { RoleManagement } = lazily(() => import("../../pages/admin/role"));
  //     return RoleManagement;
  //   },
  //   name: "Role Management",
  //   isMenu: true,
  //   icon: AcademicCapIcon,
  //   relativePath: "/admin/role"
  // }
];

export function AdminLayout() {
  const navigate = useNavigate();

  // const menuItems: MenuProps["items"] = [
  //   {
  //     key: "usermanagement",
  //     label: "User Management",
  //     icon: <UserSwitchOutlined />
  //   },
  //   { key: "rolemanagement", label: "Role Management", icon: <TagsOutlined /> }
  // ];
  return (
    <>
      {/* <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
          items={menuItems.map((menu: any) => {
            return {
              ...menu,
              onClick: () => navigate(`${menu.key}`)
            };
          })}
        />
      </Sider>
      <Content> */}
      <div className="layout-content">
        <Outlet />
      </div>
      {/* </Content> */}
    </>
  );
}
