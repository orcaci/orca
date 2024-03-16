import { useState } from "react";
import { NodeProps, Position, useNodeId } from "reactflow";
import CustomHandle from "../handler/test";

export const LoopNode: React.FC<NodeProps> = ({ data, xPos, yPos }) => {
  const [selected, setValueSelected] = useState({} as any);
  const [open, setOpen] = useState(false);
  const nodeId = useNodeId();
  return (
    <>
      <CustomHandle
        id="input"
        type="target"
        position={Position.Top}
        connectionSize={1}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
        isConnectableStart={false}
      />
      <div className="w-96 h-10 border-white bg-teal-100 rounded-lg shadow-sm hover:shadow-md">
        <div className="self-center p-2 align-middle text-center ">
          <h3 className=" text-ellipsis text-nowrap ">
            [ Loop ] - {data?.payload?.name}
          </h3>
        </div>
      </div>

      <CustomHandle
        id="continue"
        type="target"
        position={Position.Left}
        connectionSize={1}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
        isConnectableStart={false}
      />

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
