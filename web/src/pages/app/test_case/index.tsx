import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
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
import { fetchTestCases } from "service/app/test_case";

export const TestCaseDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([] as any);
  const [testcase, setTestcase] = useState({} as any);

  const extra: Array<React.ReactNode> = [
    <Popover.Root key="index">
      <Popover.Trigger>
        <Button
          variant="soft"
          onClick={() => {
            setTestcase({});
          }}
        >
          <PlusIcon width="16" height="16" />
          Create
        </Button>
      </Popover.Trigger>
      <Popover.Content style={{ width: 360 }}>
        <Flex direction="column" gap="3">
          <Text size="5">Create New Test Case</Text>
          <TextField.Input
            size="3"
            placeholder="Name"
            onChange={(e: { target: { value: any } }) =>
              setCreateTestCase("name", e.target.value)
            }
          />
          <TextArea
            placeholder="Description"
            onChange={(e) => setCreateTestCase("description", e.target.value)}
          />
          <Popover.Close>
            <Button
              color="indigo"
              variant="soft"
              className="flex-shrink-0"
              onClick={() => onCreateTestCase()}
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
      render: (_: string, record: any) => {
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

  const setCreateTestCase = (field_id: string, value: any) => {
    let _data = { ...testcase };
    _data[field_id] = value;
    setTestcase(_data);
  };

  const updateTableInfo = (event: EventSource, field_id: string) => {};

  const getCaseList = () => {
    fetchTestCases(appId).then((cases: any) => {
      setDataSource(cases);
    })
    .finally(() => {});
  }

  useEffect(() => {
    getCaseList();
  }, []);

  /**
   * onHandleClick - Handle the Test case redirect
   * @param record
   */
  const onHandleClick = (record: any) => {
    navigate(`${record.id}`);
  };

  /**
   * onCreateTestCase - will create new Test Case
   * @param data
   */
  const onCreateTestCase = async () => {
    let payload = {
      ...testcase,
      app_id: appId
    };
    await Service.post(`${Endpoint.v1.case.create(appId)}`, {
      body: payload
    })
      .then((record: any) => {
        getCaseList();
      })
      .finally(() => {});
  };

  /**
   * onDelete - Delete theTest Case with a confirmation
   * @param caseId
   */
  const onDelete = async (caseId: any) => {
    await Service.delete(`${Endpoint.v1.case.delete(appId, caseId)}`)
      .then(() => {
        getCaseList();
      })
      .finally(() => {});
  };

  return (
    <ReadOnlyTable
      title="Test Case"
      column={columns}
      data={dataSource}
      extra={extra}
    />
  );
};
