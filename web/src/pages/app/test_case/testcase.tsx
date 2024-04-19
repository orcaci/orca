import { PageHeader } from "core/components/page_header";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Service } from "service";
import { Endpoint } from "service/endpoint";
import { useTestCaseStore } from "stores/testcase.store";
import { shallow } from "zustand/shallow";

import { PlayCircleIcon } from "@heroicons/react/24/outline";
import { Workflow } from "core/components/flow";
import { Spinner } from "core/components/spinner";
import { flowStateSelector, useFlowStore } from "stores/flow.store";
import { ToastComponent } from "core/components/toast";
import { Button } from "@radix-ui/themes";

import "./index.css";

export interface TestCaseexecutionItem {
  case_id: string;
  execution_order: number;
  id: string;
  kind: string;
  parent_id?: string;
  reference: string;
  type_field: string;
}

export interface TestCaseData {
  id: string;
  name: string;
  description: string;
  app_id: string;
  case_execution: TestCaseexecutionItem[];
}

export function TestCasePage() {
  const { appId = "", testCaseId = "" } = useParams();
  const [isDryRunLoading, setIsDryRunLoading] = useState(false);
  const [showToast, setShowToast] = useState({ title: "", status: "" });
  const {
    graph,
    setGraph
  } = useFlowStore(flowStateSelector, shallow);

  const fetchTestCase = async () => {
    await Service.get(`${Endpoint.v1.case.itemList(appId, testCaseId)}`)
      .then((caseblock) => {
        setGraph(caseblock.case_execution || []);
      })
      .finally(() => { });
  };

  useEffect(() => {
    fetchTestCase();
  }, [appId]);

  const { name } = useTestCaseStore(
    (state) => ({ name: state.name, hasData: state.case_execution.length > 0 }),
    shallow
  );


  const handleRun = () => {
    useFlowStore.getState().setCurrentNode({})
    if(graph.length === 0) {
      setShowToast({ title: "No action was configured", status: "error" });
      return null;
    }
    const checkValidTestCase = graph.some(item => !item.reference)
    if(!checkValidTestCase) {
    setIsDryRunLoading(true);
    Service.post(`${Endpoint.v1.case.run(appId, testCaseId)}`).catch((err) => {
      setIsDryRunLoading(false);
      setShowToast({ title: "Dry Run was failed", status: "error" });
    }).finally(() => {
      setIsDryRunLoading(false);
      setShowToast({ title: "Dry Run was successfull", status: "success" });
    });
  } else {
    setShowToast({ title: "Some action was not configured properly", status: "error" });
  }
  };

  return (
    <>
      {isDryRunLoading && (
        <div className="loader">
          <Spinner />
        </div>
      )}
      <PageHeader
        backIcon
        title={name}
        extra={
          <div className=" flex items-center gap-3">
            <Button
              variant="soft"
              className="flex items-center gap-3"
              onClick={handleRun}
            >
             Save
            </Button>

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
      <Workflow></Workflow>
      {showToast.title && <ToastComponent
        title={showToast.title}
        onClose={() => setShowToast({ title: "", status: ""})}
        status={showToast.status}
      />}
    </>
  );
}
