import { XMarkIcon } from "@heroicons/react/24/outline";
import { NodeProps, Position } from "reactflow";
import CustomHandle from "../handler/test";


export const EndLoopNode: React.FC<NodeProps> = ({ data, xPos, yPos }) => {
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
        className="relative rounded-full p-1 text-red-600 shadow-sm hover:shadow-md bg-red-100 font-bold"
       
      >
        <XMarkIcon width="20" height="20" className="self-center px-auto" />
      </div>
      <CustomHandle
        id="continue"
        type="source"
        position={Position.Left}
        connectionSize={1}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
        isConnectableEnd={false}
      />
      <CustomHandle
        id="end"
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
