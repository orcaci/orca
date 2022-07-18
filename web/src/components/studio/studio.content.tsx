// @ts-nocheck
import React, { useCallback, useState } from "react";
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, MarkerType } from 'react-flow-renderer';
import { Node } from "../node";
import { EndNode } from "../node/step/end";
import { StartNode } from "../node/step/start";
import { StepGroupNode } from "../block/stepgroup";
import { CommandNode } from "../node/step/command";
const nodeSource = [
  {
    id: "1",
    type: "start",
    data: {
      data: { label: "Input Node" },
    },
    position: { x: 100, y: 0 }
  },
  {
    id: "2",
    type: "command",
    data: {
      label: (
        <>
          This is a <strong>default node</strong>
        </>
      )
    },
    position: { x: 200, y: 0 }
  },
  {
    id: "3",
    type: "end",
    data: { label: "Input Node" },
    position: { x: 400, y: 0 },
  }
];
const nodeTypes = { command: CommandNode, start: StartNode, end: EndNode };

const edgeSource = [
  { id: "e1-2", source: "1", target: "2", animated: true, markerEnd: {
    type: MarkerType.ArrowClosed,
  } },
  { id: "e1-3", source: "2", target: "3", animated: true, markerEnd: {
    type: MarkerType.ArrowClosed,
  } },
  // {
  //   id: "e3-4",
  //   source: "3",
  //   target: "4",
  //   animated: true,
  //   label: "animated edge"
  // },
  // {
  //   id: "e4-5",
  //   source: "4",
  //   target: "5",
  //   label: "edge with arrow head",
  //   markerEnd: {
  //     type: MarkerType.ArrowClosed
  //   }
  // },
  // {
  //   id: "e5-6",
  //   source: "5",
  //   target: "6",
  //   type: "smoothstep",
  //   label: "smooth step edge"
  // },
  // {
  //   id: "e5-7",
  //   source: "5",
  //   target: "7",
  //   type: "step",
  //   style: { stroke: "#f6ab6c" },
  //   label: "a step edge",
  //   animated: true,
  //   labelStyle: { fill: "#f6ab6c", fontWeight: 700 }
  // }
];

export function StudioContent() {
  const [nodes, setNodes] = useState(nodeSource);
  const [edges, setEdges] = useState(edgeSource);
  // const { mainelements } = props;
  // export const StudioContent: React.FC<IMyProps> = (props: IMyProps) => {
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  return (
    <div className="flex">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={{backgroundColor: "#B8CEFF",position: "absolute"}}
      >
        {/* <MiniMap
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
        /> */}
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
