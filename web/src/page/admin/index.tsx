import React from "react";
import styles from "./admin.module.css";
import {
  Table,
  Tag,
  Space,
  Switch,
  Popconfirm,
  message,
  Form,
  Modal,
  Input,
  Select
} from "antd";
// import { Link } from "react-router-dom";
// import {EditModal} from "../components/editModal/index"
const { Option } = Select;

const data = [
  {
    key: "1",
    name: "John Brown",
    email: "john@gmail.com",
    status: "Active",
    roles: ["admin"]
  },
  {
    key: "2",
    name: "Jim Green",
    email: "jim@gmail.com",
    status: "Active",
    roles: ["admin"]
  },
  {
    key: "3",
    name: "Joe Black",
    email: "joe@gmail.com",
    status: "Inactive",
    roles: ["user"]
  }
];

export function Adminpage() {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  // const [modalText, setModalText] = React.useState("");
  const [modalData, setModalData] = React.useState<any>({});

  const showModal = (record: any) => {
    setModalData(record);
    setVisible(true);
  };
  const [form] = Form.useForm();

  const handleOk = (values: any) => {
    console.log(values);

    // setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    form.resetFields();
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
    form.resetFields();
  };

  function confirm(e: any) {
    console.log(e);
    message.success("User deleted successfully");
  }

  function onChange(value: any) {
    console.log(`selected ${value}`);
  }

  function onSearch(val: any) {
    console.log("search:", val);
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: any) => <span>{text}</span>
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: any) =>
        status === "Active" ? (
          <Switch defaultChecked disabled />
        ) : (
          <Switch disabled />
        )
    },
    {
      title: "Roles",
      key: "roles",
      dataIndex: "roles",
      render: (tags: any) => (
        <>
          {tags.map((tag: any) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "admin") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
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
                onClick={() => showModal(record)}
              >
                Edit
              </div>
            </>
            <Popconfirm
              title="Are you sure want to delete this user?"
              onConfirm={confirm}
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
    <div className={styles.container}>
      <Table className={styles.userTable} columns={columns} dataSource={data} />
      <Modal
        title={modalData.name}
        visible={visible}
        onOk={form.submit}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form layout="vertical" form={form} onFinish={handleOk}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
            initialValue={modalData.name}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true }]}
            initialValue={modalData.email}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
            initialValue={modalData.status}
          >
            <Select
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={(input: any, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true }]}
            initialValue={modalData.roles}
          >
            <Select
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={(input: any, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
