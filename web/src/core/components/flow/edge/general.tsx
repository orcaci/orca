
import { BaseEdge, EdgeProps, getSmoothStepPath } from "reactflow";

export const DefaultEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY
  });

  return (
      <BaseEdge id={id} path={edgePath} style={{ backgroundColor: "black" }} />
  );
};
