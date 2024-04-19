import { BaseEdge, EdgeProps, getSmoothStepPath } from "reactflow";

export type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export const getSpecialPath = (
  { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
  offset: number
) => {

  return `M ${sourceX} ${sourceY} L ${targetX} ${sourceY} ${targetX} ${targetY}`;
};

// export default function CustomEdge() {
export const YesEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition
  });
  const res = getSpecialPath(
    {
      sourceX,
      sourceY,
      targetX,
      targetY
    },
    4
  );
  console.log("edgePath", edgePath);
  console.log("edgePath", `M`, res);

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ backgroundColor: "black" }} />
    </>
  );
};
