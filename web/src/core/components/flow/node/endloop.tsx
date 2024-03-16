import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { NodeProps, Position, useEdges, useNodeId, useStore } from "reactflow";
import CustomHandle from "../handler/test";

const selector = (s: any) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges
});

export const EndLoopNode: React.FC<NodeProps> = ({ data, xPos, yPos }) => {
  const [selected, setValueSelected] = useState({} as any);
  const [open, setOpen] = useState(false);
  const nodeId = useNodeId();
  const useedges = useEdges();

  const { nodeInternals } = useStore(selector);

  const node = nodeInternals.get(nodeId);

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
        onMouseOver={() => setOpen(true)}
        onMouseOut={() => setOpen(false)}
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
