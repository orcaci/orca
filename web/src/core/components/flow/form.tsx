import { Service } from "service";
import { Endpoint } from "service/endpoint";
import { useEffect, useState } from "react";
import { useFlowStore } from "stores/flow.store";
import { Button } from "@radix-ui/themes";

import { shallow } from "zustand/shallow";
import { useParams } from "react-router-dom";
import { SearchableDropdown } from "core/components/dropdown/index.jsx";

import "./index.css"


export const WorkflowForm: React.FC = () => {
  const { appId = "" } = useParams();
  const [dataSource, setDataSource] = useState([] as any);
  const [actionGroup, setActionGroup] = useState({});
  const { currentNode, graph, setGraph } = useFlowStore(
    (state: any) => ({
      currentNode: state.currentNode,
      graph: state.graph,
      setGraph: state.setGraph,
    }),
    shallow
  );

  /**
   * fetchActionGroups - fetch all ActionGroup from the specify Application
   */
  const fetchActionGroups = async () => {
    await Service.get(`${Endpoint.v1.group.getList(appId)}`)
      .then((groups) => {
        setDataSource(groups);

      })
      .finally(() => {
      });
  };


  useEffect(() => {
    fetchActionGroups();
  }, []);


  useEffect(() => {
    if (dataSource.length > 0) {
      const selectedActionGroup = dataSource.find((item: any) => item.id === currentNode.reference);
      setActionGroup(selectedActionGroup || {});
    }
  }, [currentNode, dataSource]);


  const onUpdateActionGroup = (val: any) => {
    const newGraph = graph.map((item: any) => {
      if (item.id === currentNode.id) {
        return {
          ...item,
          name: val.name,
          reference: val.id,
        };
      }
      return item;
    })
    setGraph(newGraph);
  }

  return (
    <>
      <div className="closeForm" onClick={() => useFlowStore.getState().setCurrentNode({})} />
      <div className="p-4">
        <div className="pb-4 text-gray-900"> Select action group:</div>
        <SearchableDropdown
          options={dataSource || []}
          label="name"
          id="id"
          selectedValue={actionGroup}
          handleChange={(val: any) => {
            setActionGroup(val)
          }}
        />
        {Object.keys(actionGroup).length > 0 &&
          <div className="mt-8">
            <Button
              variant="soft"
              className="flex  items-center gap-3"
              onClick={() => onUpdateActionGroup(actionGroup)}
            >
              Save
            </Button>
          </div>}
      </div>
    </>
  );
};
