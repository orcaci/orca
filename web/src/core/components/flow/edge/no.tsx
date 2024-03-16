import { useState } from "react";
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
  const [open, setOpen] = useState(false);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ backgroundColor: "black" }} />
      {/* <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${targetX}px,${sourceY + 40
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
