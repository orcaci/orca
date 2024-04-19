import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Button,
  Flex,
  IconButton,
  Link,
  Popover,
  Text,
  TextArea,
  TextField,
  Tooltip
} from "@radix-ui/themes";

import { ColumnField } from "core/components/table";
import { ReadOnlyTable } from "core/components/table/read";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Service } from "service";
import { Endpoint } from "service/endpoint";

export const ActionGroupDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([] as any);
  const [groupAction, setgroupAction] = useState({} as any);

  const extra: Array<React.ReactNode> = [
    <Popover.Root key="popover">
      <Popover.Trigger>
        <Button
          variant="soft"
          onClick={() => {
            setgroupAction({});
          }}
        >
          <PlusIcon width="16" height="16" />
          Create
        </Button>
      </Popover.Trigger>
      <Popover.Content style={{ width: 360 }}>
        <Flex direction="column" gap="3">
          <Text size="5">Create New Action group</Text>
          <TextField.Input
            size="3"
            placeholder="Name"
            onChange={(e: { target: { value: any } }) =>
              setCreateGroupAction("name", e.target.value)
            }
          />
          <TextArea
            placeholder="Description"
            onChange={(e) =>
              setCreateGroupAction("description", e.target.value)
            }
          />
          <Popover.Close>
            <Button
              color="indigo"
              variant="soft"
              className="flex-shrink-0"
              onClick={() => onCreateNewActionGroup()}
            >
              Create
            </Button>
          </Popover.Close>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  ];

  const columns: Array<ColumnField> = [
    {
      key: "name",
      label: "Name",
      className: "flex-auto ",
      render: (text: string, record: any) => (
        <Link onClick={() => onHandleClick(record)}>{text}</Link>
      )
    },
    {
      key: "description",
      label: "Description",
      className: "flex-auto "
    },
    {
      key: "action",
      label: "Action",
      className: "flex-initial w-48",
      render: (text: string, record: any) => {
        return (
          <Flex align="center" gap="3">
            <Tooltip content="Edit">
              <IconButton
                className="cursor-pointer"
                variant="soft"
                onClick={() => onHandleClick(record)}
              >
                <PencilIcon className="size-4" />
              </IconButton>
            </Tooltip>

            <Tooltip content="Delete">
              <IconButton
                className="cursor-pointer"
                color="red"
                variant="soft"
                onClick={() => onDelete(record.id)}
              >
                <TrashIcon className="size-4" />
              </IconButton>
            </Tooltip>
          </Flex>
        );
      }
    }
  ];

  const { appId = "" } = useParams();

  const setCreateGroupAction = (field_id: string, value: any) => {
    let _data = { ...groupAction };
    _data[field_id] = value;
    setgroupAction(_data);
  };

  /**
   * fetchActionGroups - fetch all ActionGroup from the specify Application
   */
  const fetchActionGroups = async () => {
    await Service.get(`${Endpoint.v1.group.getList(appId)}`)
      .then((groups) => {
        setDataSource(groups);
      })
      .finally(() => {});
  };

  useEffect(() => {
    fetchActionGroups();
  }, []);

  /**
   * onHandleClick - Handle the Action redirect
   * @param record
   */
  const onHandleClick = (record: any) => {
    navigate(`${record.id}`);
  };

  /**
   * onCreateNewActionGroup - will create new Action Group
   * @param data
   */
  const onCreateNewActionGroup = async () => {
    let payload = {
      ...groupAction,
      app_id: appId,
      type_field: "ActionGroup"
    };
    await Service.post(`${Endpoint.v1.group.create(appId)}`, {
      body: payload
    })
      .then((record: any) => {
        fetchActionGroups();
      })
      .finally(() => {});
  };

  /**
   * onDelete - Delete the Action Group with a confirmation
   * @param groupId
   */
  const onDelete = async (groupId: any) => {
    await Service.delete(`${Endpoint.v1.group.delete(appId, groupId)}`)
      .then(() => {
        fetchActionGroups();
      })
      .finally(() => {});
  };

  return (<ReadOnlyTable
        title="Action Group"
        column={columns}
        data={dataSource}
        extra={extra}
      />
  );
};
