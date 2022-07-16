import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  Space,
  Button,
  Typography,
  Popconfirm,
  Form,
  Input,
  Breadcrumb
} from "antd";
import { Link, useParams } from "react-router-dom";

import { IProfileItems, IProfile } from "../interface/profile";
import { Service } from "../service";
import { CreateProfileModal } from "./create";

import styles from "./profile.module.css";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: IProfile;
  index: number;
  children: React.ReactNode;
}

export function Profiles() {
  // const history = useHistory();
  const { profileId } = useParams() as any;
  const COLUMNS = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
      width: "40%"
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      editable: true,
      width: "40%"
    },
    {
      title: "Action",
      key: "action",
      editable: false,
      width: "20%",
      render: (text: string, record: IProfile) => {
        if (editingKey === record.key) {
          return (
            <Space size="middle">
              <Typography.Link onClick={(e) => onEditSave()}>
                Save
              </Typography.Link>
              <Typography.Link onClick={(e) => setEditingKey("")}>
                Cancel
              </Typography.Link>
            </Space>
          );
        }
        return (
          <Space size="middle">
            {!profileId && (
              <Typography.Link
                onClick={() => {
                  // history.push(`/profiles/${record.id}`);
                }}
              >
                View
              </Typography.Link>
            )}
            <Typography.Link onClick={() => onEdit(record)}>
              Edit
            </Typography.Link>
            <Popconfirm
              title="Are you sure you want to delete"
              onConfirm={() => onDelete(record)}
            >
              <Typography.Link>Delete</Typography.Link>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  const [profileData, setProfileData] = useState<IProfileItems>([]);
  const [editingKey, setEditingKey] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const [form] = Form.useForm();

  const resetState = useCallback(function () {
    setProfileData([]);
    setEditingKey("");
  }, []);

  useEffect(
    function getProfileData() {
      let url = "/v1/profile/";
      if (profileId) {
        url = `/v1/profile/${profileId}/data/`;
      }
      const req = Service.get(url);
      req.then((response: IProfileItems) => {
        const profiles = response.map((item) => {
          return {
            ...item,
            key: item.name
          };
        });
        setProfileData(profiles);
      });
      return () => {
        resetState();
      };
    },
    [profileId, resetState]
  );

  function onEdit(record: IProfile) {
    setEditingKey(record.key);
    form.setFieldsValue({ ...record });
    console.log(record);
  }

  function onDelete(record: IProfile) {
    console.log(record);
  }

  function onEditSave() {
    const { name, value } = form.getFieldsValue();
    console.log("saving", name, value);
    setEditingKey("");
  }

  const isEditing = (record: IProfile) => record.key === editingKey;

  const mergedColumns = COLUMNS.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IProfile) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  function EditableCell({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }: EditableCellProps) {
    const inputNode = <Input />;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please input ${title}!`
              }
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  }

  const breadCrumbData = useMemo(
    function getBreadCrumbData() {
      let breadCrumb = [
        {
          label: "Home",
          to: "/home"
        }
      ];
      if (profileId) {
        breadCrumb = breadCrumb.concat([
          {
            label: "Profiles",
            to: "/profiles"
          },
          {
            label: profileId,
            to: `/profiles/${profileId}`
          }
        ]);
      } else {
        breadCrumb = breadCrumb.concat([
          {
            label: "Profiles",
            to: "/profiles"
          }
        ]);
      }
      return breadCrumb;
    },
    [profileId]
  );

  function onCreateProfile(data: any) {
    const { name, isDefault, value } = data;
    const body: any = {
      name,
      value
    };
    if (!profileId) {
      // eslint-disable-next-line camelcase
      body.is_default = isDefault;
    }
    let url = "/v1/profile/";
    if (profileId) {
      url = `/v1/profile/${profileId}/data/`;
    }
    const req = Service.post(url, { body });
    req.then((response: any) => {
      setProfileData((state: any) => {
        return [{ ...response, key: response.name }, ...state];
      });
    });
  }

  return (
    <div className={styles.profilecontainer}>
      <div className={styles.breadcrumbcontainer}>
        <Breadcrumb separator=">">
          {breadCrumbData.map((item, index) => {
            return (
              <Breadcrumb.Item key={index}>
                <Link to={item.to}>{item.label}</Link>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      </div>
      <div className={styles.createcontainer}>
        <div className={styles.header}>
          <Button type="primary" onClick={() => setShowCreateModal(true)}>
            Create Profile
          </Button>
        </div>
      </div>
      <div className={styles.tablecontainer}>
        <Form form={form} component={false}>
          <Table
            components={{ body: { cell: EditableCell } }}
            dataSource={profileData}
            columns={mergedColumns}
            bordered
          />
        </Form>
      </div>
      {showCreateModal && (
        <CreateProfileModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(data: any) => {
            onCreateProfile(data);
            setShowCreateModal(false);
          }}
          shouldIncludeCheckbox={!profileId}
        />
      )}
    </div>
  );
}
