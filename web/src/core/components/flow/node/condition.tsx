import { NodeProps, Position } from "reactflow";
import CustomHandle from "../handler/test";

export const ConditionalNode: React.FC<NodeProps> = ({ data, xPos, yPos }) => {
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
      <div className="w-96 h-10 border-white bg-orange-100 rounded-lg shadow-sm hover:shadow-md">
        <div className="self-center p-2 align-middle text-center ">
          <h3 className=" text-ellipsis text-nowrap ">
            {data?.payload?.name}
          </h3>
        </div>
      </div>

      <CustomHandle
        id="yes"
        type="source"
        position={Position.Left}
        connectionSize={1}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
        isConnectableEnd={false}
      />
      <CustomHandle
        id="no"
        type="source"
        position={Position.Right}
        connectionSize={1}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
        isConnectableEnd={false}
      />
    </>
  );
};
