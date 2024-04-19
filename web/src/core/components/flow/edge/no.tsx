import { BaseEdge, EdgeProps, getSmoothStepPath } from "reactflow";

export const NoEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition
}) => {
  const [edgePath ] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition
  });

  return (
      <BaseEdge id={id} path={edgePath} style={{ backgroundColor: "black" }} />
  );
};
