import { useEffect, useState } from "react";
import { NodeProps, Position, useNodeId } from "reactflow";
import { useFlowStore } from "stores/flow.store";
import { classNames } from "..";
import CustomHandle from "../handler/test";

export const ActionNode: React.FC<NodeProps> = ({ data, xPos, yPos }) => {
  const [selected, setValueSelected] = useState({} as any);
  const [open, setOpen] = useState(false);
  const nodeId = useNodeId();
  let bgColor =
    data?.payload?.type_field == "Assertion" ? "bg-red-100" : "bg-indigo-100";

  useEffect(() => {
    bgColor =
      data?.payload?.type_field == "Assertion" ? "bg-red-100" : "bg-indigo-100";
  }, [data]);
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
          "w-96 h-10 border-white rounded-lg shadow-sm hover:shadow-md",
          bgColor
        )}
      >
        <div
          className="self-center p-2 align-middle text-center "
          onClick={() => useFlowStore.getState().setCurrentNode(data?.payload)}
        >
          [ {data?.payload?.type_field} ] - {data?.payload?.name}
        </div>
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
