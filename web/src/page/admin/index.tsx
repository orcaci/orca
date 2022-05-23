import React, { useEffect } from "react";
import styles from "./admin.module.css";
import {
  Table,
  // Tag,
  Space,
  // Switch,
  Popconfirm,
  message,
  Form,
  Modal,
  Input,
  // Select,
  Button
} from "antd";
import { Service } from "../../service";
// import { Link } from "react-router-dom";
// import {EditModal} from "../components/editModal/index"
// const { Option } = Select;

// const data = [
//   {
//     key: "1",
//     name: "John Brown",
//     email: "john@gmail.com",
//     status: "Active",
//     roles: ["admin"]
//   },
//   {
//     key: "2",
//     name: "Jim Green",
//     email: "jim@gmail.com",
//     status: "Active",
//     roles: ["admin"]
//   },
//   {
//     key: "3",
//     name: "Joe Black",
//     email: "joe@gmail.com",
//     status: "Inactive",
//     roles: ["user"]
//   }
// ];

export function Adminpage() {
  // const [visible, setVisible] = React.useState(false);
  const [isCreate, setIsCreate] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  // const [modalText, setModalText] = React.useState("");
  const [modalData, setModalData] = React.useState<any>({});
  const [userData, setUserData] = React.useState<any>([]);

  useEffect(() => {
    Service.get("/v1/admin/user/").then((response) => setUserData(response));
  }, []);

  const showModal = (record: any) => {
    setModalData(record);
    // setVisible(true);
  };
  const [form] = Form.useForm();

  function onCreateuserClick() {
    form.resetFields();
    setIsCreate(true);
  }

  const onFormSubmit = (values: any) => {
    // console.log("MURALI createHandleOk VALUES", values);
    function updateData(response: any) {
      setUserData((state: any) => {
        if (isCreate) {
          return [...state, response];
        } else {
          const dataIndex = state.findIndex(
            (user: any) => user.id === values.id
          );
          const cloneData = { ...values };
          state[dataIndex] = cloneData;
          state[dataIndex].roles = [cloneData.roles].flat();
          return [...state];
        }
      });
    }
    let url: String = "/v1/admin/user/";
    let promise = Service.post;
    if (!isCreate) {
      url = `/v1/admin/user/${values.id}`;
      promise = Service.update;
    }
    const body = { ...values };
    promise(url, { body })
      .then((response: any) => {
        updateData(response);
      })
      .catch(() => {
        updateData({});
      });
    setModalData({});

    // setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    // form.resetFields();
    // setTimeout(() => {
    setIsCreate(false);
    setConfirmLoading(false);
    // }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setIsCreate(false);
    setModalData({});
    // form.resetFields();
  };

  function confirmDelete(e: any) {
    console.log("e", e);

    let url: String = `/v1/admin/user/${e.id}`;
    Service.delete(url).then((response: any) => {
      setUserData((state: any) => {
        return state.filter((item: any) => item.id !== e.id);
      });
    });
    message.success("User deleted successfully");
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: any) => <span>{text}</span>
    },
    {
      title: "Firstname",
      dataIndex: "first_name",
      key: "first_name",
      render: (text: any) => <span>{text}</span>
    },
    {
      title: "Lastname",
      dataIndex: "last_name",
      key: "last_name",
      render: (text: any) => <span>{text}</span>
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
      render: (text: string, record: any) => {
        return (
          <Space size="middle">
            <>
              <div
                className={styles.userEdit}
                onClick={() => {
                  console.log("REC", record);
                  showModal({ ...record });
                }}
              >
                Edit
              </div>
            </>
            <Popconfirm
              title="Are you sure want to delete this user?"
              onConfirm={() => confirmDelete(record)}
              // onCancel={cancel}
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

  return (
    <div>
      <div className={styles.buttoncontainer}>
        <Button type="primary" onClick={onCreateuserClick}>
          Create User
        </Button>
        {(isCreate || Object.keys(modalData).length > 0) && (
          <Modal
            title={isCreate ? "Create User" : "Edit User"}
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
                  id: modalData.id,
                  key: modalData.key
                })
              }
            >
              <Form.Item
                key={"name"}
                name="name"
                label="Name"
                rules={[{ required: true }]}
                preserve={false}
                initialValue={modalData.name}
              >
                <Input />
              </Form.Item>
              <Form.Item
                key={"first_name"}
                name="first_name"
                label="First name"
                rules={[{ required: true }]}
                preserve={false}
                initialValue={modalData.first_name}
              >
                <Input />
              </Form.Item>
              <Form.Item
                key={"last_name"}
                name="last_name"
                label="Last name"
                rules={[{ required: true }]}
                preserve={false}
                initialValue={modalData.last_name}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true }]}
                preserve={false}
                initialValue={modalData.email}
              >
                <Input type="email" />
              </Form.Item>
              {/* <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
              preserve={false}
              initialValue={modalData.status}
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
              initialValue={modalData.roles}
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
