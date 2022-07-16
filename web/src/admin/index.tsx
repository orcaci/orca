import React, { useEffect } from "react";
import styles from "./admin.module.css";
import {
  Table,
  Space,
  Popconfirm,
  message,
  Form,
  Modal,
  Input,
  Button
} from "antd";
import { Service } from "../service";
import { IUser, IUserList } from "../interface/user";

const MODAL_STATES = {
  CREATE: "CREATE",
  EDIT: "EDIT"
};

const INITIAL_USER_STATE = {
  name: "",
  first_name: "",
  last_name: "",
  email: ""
};

export function Adminpage() {
  const [modalState, setModalState] = React.useState<string>("");
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [editModalData, setEditModalData] =
    React.useState<IUser>(INITIAL_USER_STATE);
  const [userData, setUserData] = React.useState<IUserList>([]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Firstname",
      dataIndex: "first_name",
      key: "first_name"
    },
    {
      title: "Lastname",
      dataIndex: "last_name",
      key: "last_name"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    // {
    //   title: "Status",
    //   dataIndex: "is_active",
    //   key: "is_active",
    //   render: (status: any) => {
    //     if (typeof status === "string") {
    //       status = status === "Active" ? true : false;
    //     }
    //     return status ? "Active" : "Inactive";
    //     // return status.toLowerCase() === "active" ? (
    //     //   <Switch defaultChecked disabled />
    //     // ) : (
    //     //   <Switch disabled />
    //     // );
    //   }
    // },
    // {
    //   title: "Roles",
    //   key: "roles",
    //   dataIndex: "roles",
    //   render: (tags: any = []) => (
    //     <>
    //       {tags.map((tag: any) => {
    //         let color = tag.length > 5 ? "geekblue" : "green";
    //         if (tag === "admin") {
    //           color = "volcano";
    //         }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   )
    // },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (text: string, record: IUser) => {
        return (
          <Space size="middle">
            <>
              <div
                className={styles.userEdit}
                onClick={() => {
                  showModal({ ...record });
                }}
              >
                Edit
              </div>
            </>
            <Popconfirm
              title="Are you sure want to delete this user?"
              onConfirm={() => confirmDelete(record)}
              okText="Delete"
              cancelText="Cancel"
            >
              <div className={styles.userDelete}>Delete</div>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  const [form] = Form.useForm();

  useEffect(() => {
    Service.get("/v1/admin/user/").then((response) => setUserData(response));
  }, []);

  const showModal = (record: IUser) => {
    setModalState(MODAL_STATES.EDIT);
    setEditModalData(record);
  };

  function onCreateuserClick() {
    form.resetFields();
    setModalState(MODAL_STATES.CREATE);
  }

  const onFormSubmit = (values: IUser) => {
    function updateData(response: IUser) {
      setUserData((state: IUserList) => {
        if (modalState === MODAL_STATES.CREATE) {
          return [response, ...state];
        } else {
          return [...state];
        }
      });
    }
    let url = "/v1/admin/user/";
    let promise = Service.post;
    if (modalState !== MODAL_STATES.CREATE) {
      url = `/v1/admin/user/${values.id}`;
      promise = Service.update;
    }
    const body = { ...values };
    promise(url, { body })
      .then((response: IUser) => {
        updateData(response);
      })
      .catch(() => {
        if (modalState === MODAL_STATES.EDIT) {
          updateData(body);
        }
      });
    resetStates();
  };

  const resetStates = () => {
    setEditModalData(INITIAL_USER_STATE);
    setConfirmLoading(true);
    setModalState("");
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    resetStates();
  };

  function confirmDelete(e: IUser) {
    Service.delete(`/v1/admin/user/${e.id}`).then(() => {
      setUserData((state: IUserList) => {
        return state.filter((item: IUser) => item.id !== e.id);
      });
    });
    message.success("User deleted successfully");
  }

  return (
    <div>
      <div className={styles.buttoncontainer}>
        <Button type="primary" onClick={onCreateuserClick}>
          Create User
        </Button>
        {modalState && (
          <Modal
            title={
              modalState === MODAL_STATES.CREATE ? "Create User" : "Edit User"
            }
            visible={true}
            onOk={form.submit}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            className={styles.editModalElement}
          >
            <Form
              layout="vertical"
              form={form}
              onFinish={(values) =>
                onFormSubmit({
                  ...values,
                  id: editModalData.id,
                  key: editModalData.key
                })
              }
            >
              <Form.Item
                key={"name"}
                name="name"
                label="Name"
                rules={[{ required: true }]}
                preserve={false}
                initialValue={editModalData.name}
              >
                <Input />
              </Form.Item>
              <Form.Item
                key={"first_name"}
                name="first_name"
                label="First name"
                rules={[{ required: true }]}
                preserve={false}
                initialValue={editModalData.first_name}
              >
                <Input />
              </Form.Item>
              <Form.Item
                key={"last_name"}
                name="last_name"
                label="Last name"
                rules={[{ required: true }]}
                preserve={false}
                initialValue={editModalData.last_name}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true }]}
                preserve={false}
                initialValue={editModalData.email}
              >
                <Input type="email" />
              </Form.Item>
              {/* <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
              preserve={false}
              initialValue={editModalData.status}
            >
              <Select
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="Invited">Invited</Option>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item> */}
              {/* <Form.Item
              name="roles"
              label="Role"
              rules={[{ required: true }]}
              preserve={false}
              initialValue={editModalData.roles}
            >
              <Select
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="Admin">Admin</Option>
                <Option value="User">User</Option>
              </Select>
            </Form.Item> */}
            </Form>
          </Modal>
        )}
      </div>
      <div className={styles.container}>
        <Table
          className={styles.userTable}
          columns={columns}
          dataSource={userData}
        />
      </div>
    </div>
  );
}
