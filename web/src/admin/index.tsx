import React from "react";
import styles from "./admin.module.css";
import { Table, Tag, Space, Switch, Popconfirm, message } from 'antd';
// import { Link } from "react-router-dom";
// import {EditModal} from "../components/editModal/index"


function confirm(e: any) {
  console.log(e);
  message.success('User deleted successfully');
}


const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: any) => <span>{text}</span>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: any) => status === "Active" ? <Switch defaultChecked disabled /> : <Switch disabled />,
  },
  {
    title: 'Roles',
    key: 'roles',
    dataIndex: 'roles',
    render: (tags: any) => (
      <>
        {tags.map((tag: any) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'admin') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: string, record: any) =>
    (
      <Space size="middle">
        <span>Edit</span>
        <Popconfirm
          title="Are you sure want to delete this user?"
          onConfirm={confirm}
          // onCancel={cancel}
          okText="Delete"
          cancelText="Cancel"
        >
          <a href="/" className={styles.userDelete}>Delete</a>
        </Popconfirm>

      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    email: "john@gmail.com",
    status: 'Active',
    roles: ['admin'],
  },
  {
    key: '2',
    name: 'Jim Green',
    email: "jim@gmail.com",
    status: 'Active',
    roles: ['admin'],
  },
  {
    key: '3',
    name: 'Joe Black',
    email: "joe@gmail.com",
    status: 'Inactive',
    roles: ['user'],
  },
];

export function Adminpage() {
  return (
    <div className={styles.container}>
      <Table className={styles.userTable} columns={columns} dataSource={data} />
    </div>
  );
}
