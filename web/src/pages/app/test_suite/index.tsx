import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button, Flex, IconButton, Link, Popover, Text, TextArea, TextField, Tooltip } from "@radix-ui/themes";
import { ColumnField } from "core/components/table";
import { ReadOnlyTable } from "core/components/table/read";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTestSuite, createNewSuit, deleteSuite } from "service/app/test_suite";

export const TestSuiteDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([] as any);
  const [testSuite, setTestSuite] = useState({} as any);

  const { appId = "" } = useParams();

  useEffect(() => {
    getSuiteList();
  }, []);

  const setCreateTestSuite = (field_id: string, value: any) => {
    let _data = { ...testSuite };
    _data[field_id] = value;
    setTestSuite(_data);
  };

  const getSuiteList = () => {
    fetchTestSuite(appId).then((suites: any) => {
      setDataSource(suites);
    })
      .finally(() => {
      });
  }

  /**
   * onCreateTestSuite - will create new Test suite
   * @param data
   */
  const onCreateTestSuite = async () => {
    let payload = {
      ...testSuite,
      app_id: appId
    };

    createNewSuit(appId, payload).then((suites: any) => {
      getSuiteList();
    })
      .finally(() => {
      });
  };

  /**
   * onDelete - Delete theTest suite with a confirmation
   * @param suiteId
   */
  const onDelete = async (suiteId: any) => {
    deleteSuite(appId, suiteId).then((suites: any) => {
      getSuiteList();
    })
      .finally(() => {
      });
  };


    /**
 * onHandleClick - Handle the Test suite redirect
 * @param record
 */
    const onHandleClick = (record: any) => {
      navigate(`${record.id}`);
    };

  const extra: Array<React.ReactNode> = [
    <Popover.Root key="suitePopover">
      <Popover.Trigger>
        <Button
          variant="soft"
          onClick={() => {
            setTestSuite({});
          }}
        >
          <PlusIcon width="16" height="16" />
          Create
        </Button>
      </Popover.Trigger>
      <Popover.Content style={{ width: 360 }}>
        <Flex direction="column" gap="3">
          <Text size="5">Create New Test Suite</Text>
          <TextField.Input
            size="3"
            placeholder="Name"
            onChange={(e: { target: { value: any } }) =>
              setCreateTestSuite("name", e.target.value)
            }
          />
          <TextArea
            placeholder="Description"
            onChange={(e) => setCreateTestSuite("description", e.target.value)}
          />
          <Popover.Close>
            <Button
              color="indigo"
              variant="soft"
              className="flex-shrink-0"
              onClick={() => onCreateTestSuite()}
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


  return (
    <ReadOnlyTable
      title="Test Suite"
      column={columns}
      data={dataSource}
      extra={extra}
    />
  );
};
