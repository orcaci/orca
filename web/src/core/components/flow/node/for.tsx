import { useState } from "react";
import { NodeProps, Position, useNodeId } from "reactflow";
import CustomHandle from "../handler/test";

export const ForNode: React.FC<NodeProps> = ({ data, xPos, yPos }) => {
  const [selected, setValueSelected] = useState({} as any);
  const [open, setOpen] = useState(false);
  const nodeId = useNodeId();
  console.log("x - ", xPos, ", y -", yPos);
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
      <div className="h-14 w-96 border-1 border-white bg-indigo-400 rounded-lg shadow-sm hover:shadow-md flex items-stretch">
        <div className="self-center p-3 align-middle">
          [ {data?.payload?.type_field} ] {nodeId}
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
