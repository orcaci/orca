import { PageHeader } from "core/components/page_header";
import { useEffect, useState } from "react";
import { PlayCircleIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import { Button, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { ColumnField } from "core/components/table";
import { ReadOnlyTable } from "core/components/table/read";
import { SearchableDropdown } from "core/components/dropdown/index.jsx";
import { Spinner } from "core/components/spinner";
import { ToastComponent } from "core/components/toast";
import { fetchTestCases } from "service/app/test_case";
import {
  deleteSuiteBlock,
  fetchSuiteItems,
  insertSuiteBlock,
  reorderSuiteBlock,
  dryRun,
} from "service/app/test_suite";
import "./index.css";

export function TestSuitePage() {
  const { appId = "", testSuiteId = "" } = useParams();
  const [testCaseDatasource, setTestCaseDatasource] = useState([] as any);
  const [testSuiteDetails, setTestSuiteDetails] = useState([] as any);
  const [testCases, setTestCases] = useState([] as any);
  const [selectedTestCase, setSelectedTestCase] = useState({} as any);
  const [isDryRunLoading, setIsDryRunLoading] = useState(false);
  const [showToast, setShowToast] = useState({ title: "", status: "" });

  useEffect(() => {
    getTestSuiteDetails();
    getCaseList()
  }, [appId]);


  const getCaseList = () => {
    fetchTestCases(appId).then((cases: any) => {
      setTestCaseDatasource(cases);
    })
      .finally(() => {
      });
  }


  const addBlock = (testCaseObj: any) => {
    let payload = {
      reference: testCaseObj.id, execution_order: testCases.length + 1,
      type_field: "TestCase", suite_id: testSuiteId
    };
    insertSuiteBlock(appId, testSuiteId, payload).then((item) => {
      setTestCases([...testCases, item]);
      setSelectedTestCase({});
    });
  }

  const getTestSuiteDetails = () => {
    fetchSuiteItems(appId, testSuiteId).then((suites: any) => {
      setTestSuiteDetails(suites);
      setTestCases(suites.suite_execution)
    })
      .finally(() => {
      });
  }

  const handleRun = () => {
    if(testCases.length === 0) {
      setShowToast({ title: "No test case was configured ", status: "error" });
      return null;
    }
    setIsDryRunLoading(true);
    dryRun(appId, testSuiteId).then(() => {
        setIsDryRunLoading(false);
        setShowToast({ title: "Dry Run was successfull", status: "success" });

    }).catch((err) => {
      setIsDryRunLoading(false);
      setShowToast({ title: "Dry Run was failed", status: "error" });
    });
  };

  const reorderTestCase = (updatedList: any, newIndex: number) => {
    setTestCases(updatedList);
    const blockId = updatedList[newIndex].id;
    // index will be 0, but execution order will be start from 1
    reorderSuiteBlock(appId, testSuiteId, blockId, { location: newIndex +1 }).then(() => {
    });
  };

  const deleteTestCase = (id: string) => {
    deleteSuiteBlock(appId, testSuiteId, id).then((suites: any) => {
      const deletedTestCase = testCases.filter((item: any) => item.id !== id);
      setTestCases(deletedTestCase);
    })
      .finally(() => {
      });
  }
  

  const columns: Array<ColumnField> = [
    {
      key: "name",
      label: "Test case name",
      className: "flex-auto "
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
            <Tooltip content="Delete">
              <IconButton
                className="cursor-pointer"
                color="red"
                variant="soft"
                onClick={() => deleteTestCase(record.id)}
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
    <>
     {isDryRunLoading && (
        <div className="loader">
          <Spinner />
        </div>
      )}
      <PageHeader
        backIcon
        title={testSuiteDetails.name}
        extra={
          <div className=" flex items-center gap-3">
            <Button
              variant="soft"
              className="flex items-center gap-3"
              onClick={handleRun}
              color="indigo"
            >
              <PlayCircleIcon className="size-4" /> Dry Run
            </Button>
          </div>
        }
      />
      <div>
        <div className="selectTestCase">
          <h1><b>Select test case</b></h1>
          <SearchableDropdown
            options={testCaseDatasource || []}
            label="name"
            id="id"
            selectedValue={selectedTestCase}
            handleChange={(val: any) => {
              setSelectedTestCase(val);
            }}
          />
          <Button
            variant="soft"
            onClick={() => {
              selectedTestCase.id && addBlock(selectedTestCase);
            }}
          >
            <PlusIcon width="16" height="16" />
            Add
          </Button>
        </div>
        <ReadOnlyTable
          column={columns}
          data={testCases}
          showPagination={false}
          onDragEnd={(data: any, newIndex: number) => reorderTestCase(data, newIndex)}
          isDragAllowed={true}
        />
              {showToast.title && <ToastComponent
        title={showToast.title}
        onClose={() => setShowToast({ title: "", status: ""})}
        status={showToast.status}
      />}
      </div>
    </>
  );
}
