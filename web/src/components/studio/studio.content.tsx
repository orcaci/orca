import React from "react";
import ReactFlow, { MiniMap, Controls, Background } from "react-flow-renderer";
import { MarkerType } from "react-flow-renderer";
import { Node } from "../node";
import { EndNode } from "../node/step/end";
import { StartNode } from "../node/step/start";
import { StepGroupNode } from "../block/stepgroup";
const nodes = [
  {
    id: "1",
    type: "stepGroup",
    data: {
      value: 123
    },
    position: { x: 250, y: 0 }
  },
  {
    id: "2",
    type: "start",
    data: {
      label: (
        <>
          This is a <strong>default node</strong>
        </>
      )
    },
    position: { x: 100, y: 100 }
  },
  {
    id: "3",
    type: "end",
    data: {
      label: (
        <>
          This one has a <strong>custom style</strong>
        </>
      )
    },
    position: { x: 400, y: 100 },
    style: {
      background: "#D6D5E6",
      color: "#333",
      border: "1px solid #222138",
      width: 180
    }
  }
];
const nodeTypes = { stepGroup: StepGroupNode, start: StartNode, end: EndNode };

const edges = [
  { id: "e1-2", source: "1", target: "2", label: "this is an edge label" },
  { id: "e1-3", source: "1", target: "3" },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: true,
    label: "animated edge"
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    label: "edge with arrow head",
    markerEnd: {
      type: MarkerType.ArrowClosed
    }
  },
  {
    id: "e5-6",
    source: "5",
    target: "6",
    type: "smoothstep",
    label: "smooth step edge"
  },
  {
    id: "e5-7",
    source: "5",
    target: "7",
    type: "step",
    style: { stroke: "#f6ab6c" },
    label: "a step edge",
    animated: true,
    labelStyle: { fill: "#f6ab6c", fontWeight: 700 }
  }
];

export function StudioContent() {
  // const { mainelements } = props;
  // export const StudioContent: React.FC<IMyProps> = (props: IMyProps) => {
  // const onConnect = useCallback(
  //   (params) => setEdges((eds) => addEdge(params, eds)),
  //   []
  // );
  return (
    <div className="flex">
      Flow
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <MiniMap
          // nodeStrokeColor={(n) => {
          //   if (n.style?.background) return n.style.background;
          //   if (n.type === "input") return "#0041d0";
          //   if (n.type === "output") return "#ff0072";
          //   if (n.type === "default") return "#1a192b";

          //   return "#eee";
          // }}
          // nodeColor={(n) => {
          //   if (n.style?.background) return n.style.background;

          //   return "#fff";
          // }}
          nodeBorderRadius={2}
        />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
