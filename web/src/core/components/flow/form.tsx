import { Service } from "service";
import { Select as OSelect } from "core/components/select";
import { Endpoint } from "service/endpoint";
import { useEffect, useState } from "react";
import { useFlowStore } from "stores/flow.store";
import { shallow } from "zustand/shallow";
import { useParams } from "react-router-dom";
import { SearchSelect } from "core/components/select/search";

export interface WorkflowFormParm {
  title: string;
}

export const WorkflowForm: React.FC<WorkflowFormParm> = ({ title }) => {
  const [obj, setObject] = useState({} as any);
  const { appId = "" } = useParams();
  const [dataSource, setDataSource] = useState([] as any);
  const { nodes, edges, currentNode } = useFlowStore(
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
      .finally(() => {});
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
      <div className="flex w-full">
        <OSelect
          buttonClassName="relative w-full cursor-default bg-transparent py-1.5 pl-3 pr-10 text-left text-gray-900  ring-inset  focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
          options={dataSource || []}
          dataIndex="id"
          defaultValue={obj["id"]}
          onSelect={(value: any) => {
            console.log(value);
            // row["kind"] = value["key"];
          }}
          render={(row: any) => {
            return <span className="ml-3 block truncate">{row["name"]}</span>;
          }}
        ></OSelect>
        {/* <SearchSelect /> */}
        {/* <select defaultValue={obj.id}>
          <option value="">Select Option</option>
          {(dataSource || []).map((item: any) => {
            return <option key={item.id}>{item.name}</option>;
          })}
        </select> */}
        {/* <Flex gap="3">
          <Select.Root defaultValue={obj.id} key={"selectId"}>
            <Select.Trigger />
            <Select.Content>
              {(dataSource || []).map((item: any) => {
                return <Select.Item value={item.id}>{item.name}</Select.Item>;
              })}
            </Select.Content>
          </Select.Root>
        </Flex> */}
      </div>
    </>
  );
};
