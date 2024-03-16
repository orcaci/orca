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
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

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
  const [edgePath, labelX, labelY] = getSmoothStepPath({
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
      {/* <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${targetX}px,${
              sourceY + 40
            }px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all"
          }}
          className="nodrag nopan"
        >
          <New></New>
        </div>
      </EdgeLabelRenderer> */}
    </>
  );
};
