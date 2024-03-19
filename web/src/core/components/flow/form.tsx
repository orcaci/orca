import { Service } from "service";
import { Endpoint } from "service/endpoint";
import { useEffect, useState } from "react";
import { useFlowStore } from "stores/flow.store";
import { shallow } from "zustand/shallow";
import { useParams } from "react-router-dom";
import  { SearchableDropdown } from "core/components/dropdown/index.jsx";

export interface WorkflowFormParm {
    title: string;
}

export const WorkflowForm: React.FC<WorkflowFormParm> = ({title}) => {
    const [obj, setObject] = useState({} as any);
    const {appId = ""} = useParams();
    const [dataSource, setDataSource] = useState([] as any);
    const [actionGroup, setActionGroup] = useState({});
    const {nodes, edges, currentNode} = useFlowStore(
        (state: any) => ({
            nodes: state.nodes,
            edges: state.edges,
            currentNode: state.currentNode
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
                setObject(currentNode);
            })
            .finally(() => {
            });
    };

    const onCurrentNode = (node: any) => {
        setObject(node);
    };

    useEffect(() => {
        fetchActionGroups();
        // onCurrentNode(currentNode);
        // console.log(currentNode);
    }, []);

  return (
    <>
      <div className="pl-4 py-4 shadow-md lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
            {obj.name}
          </h2>
        </div>
      </div>
      <div className="">
      <div className="font-bold p-4 text-gray-900"> Select action group</div>
      <SearchableDropdown
        options={dataSource || []}
        label="name"
        id="id"
        selectedValue={actionGroup}
        handleChange={(val: any) => {
          setActionGroup(val)
        }}
      />
      </div>
    </>
  );
};
