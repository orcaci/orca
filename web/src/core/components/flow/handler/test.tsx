import { useMemo } from "react";
import {
  Handle,
  HandleProps,
  getConnectedEdges,
  useNodeId,
  useStore
} from "reactflow";

const selector = (s: any) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges
});

interface CustomHandleProps extends HandleProps {
  connectionSize?: number;
}

export const CustomHandle: React.FC<CustomHandleProps> = ({
  connectionSize,
  isConnectable,
  ...props
}) => {
  const { nodeInternals, edges } = useStore(selector);
  const nodeId = useNodeId();

  const isHandleConnectable = useMemo(() => {
    if (typeof connectionSize === "function") {
      const node = nodeInternals.get(nodeId);
      const connectedEdges = getConnectedEdges([node], edges);

      //   return connectionSize({ node, connectedEdges });
    }

    if (typeof connectionSize === "number") {
      const node = nodeInternals.get(nodeId);
      const connectedEdges = getConnectedEdges([node], edges);

      return connectedEdges.length < connectionSize;
    }

    return connectionSize;
  }, [nodeInternals, edges, nodeId, isConnectable]);

  return (
    <Handle
      {...props}
      style={{ opacity: 0 }}
      //   {
      //     {
      //       // backgroundColor: "transparent",
      //       // borderColor: "transparent",
      //       // top: "0px !important"
      //     }
      //   }

      isConnectable={isHandleConnectable}
    ></Handle>
  );
};

export default CustomHandle;
