import { useEffect } from "react";
import { NodeProps, Position } from "reactflow";
import { shallow } from "zustand/shallow";
import { IconButton } from "@radix-ui/themes";
import { TrashIcon } from "@heroicons/react/24/outline";

import { useFlowStore } from "stores/flow.store";
import { classNames } from "..";
import CustomHandle from "../handler/test";

import "./index.css";

export const ActionNode: React.FC<NodeProps> = ({ data, xPos, yPos }) => {
  const { graph, setGraph } = useFlowStore(
    (state: any) => ({
      graph: state.graph,
      setGraph: state.setGraph,
    }),
    shallow
  );

  let bgColor =
    data?.payload?.type_field == "Assertion" ? "bg-red-100" : "bg-indigo-100";

  useEffect(() => {
    bgColor =
      data?.payload?.type_field == "Assertion" ? "bg-red-100" : "bg-indigo-100";
  }, [data]);

  const onDelete = () => {
    const newGraph = graph.filter((item: any) =>
      item.id !== data?.payload.id
    )
    setGraph(newGraph);
  }

  return (
    <>
      <CustomHandle
        type="target"
        position={Position.Top}
        connectionSize={1}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
        isConnectableStart={false}
      />
      <div
        className={classNames(
          "w-96 h-10 border-white rounded-lg shadow-sm hover:shadow-md nodeContainer",
          bgColor
        )}
      >
        <div
          className="self-center p-2 align-middle text-center "
          onClick={() => useFlowStore.getState().setCurrentNode(data?.payload)}
        >
          {data?.payload?.name ? data?.payload?.name : `Configure [${data?.payload?.type_field}]`}
        </div>
        <IconButton
          className="cursor-pointer"
          color="red"
          variant="ghost"
          onClick={() => onDelete()}
        >
          <TrashIcon className="size-4" />
        </IconButton>
      </div>

      <CustomHandle
        type="source"
        position={Position.Bottom}
        connectionSize={1}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
        isConnectableEnd={false}
      />
    </>
  );
};
