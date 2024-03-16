import ReactFlow, { Background, BackgroundVariant } from "reactflow";

import { useEffect } from "react";
import "reactflow/dist/style.css";
import { RFState, useFlowStore } from "stores/flow.store";
import { shallow } from "zustand/shallow";
import { DefaultEdge } from "./edge";
import { NoEdge } from "./edge/no";
import { YesEdge } from "./edge/yes";
import { WorkflowForm } from "./form";
import { StartNode } from "./node";
import { ActionNode } from "./node/action";
import { ConditionalNode } from "./node/condition";
import { EndLoopNode } from "./node/endloop";
import { LoopNode } from "./node/loop";
import { NewNode } from "./node/new";

const nodeTypes = {
  newNode: NewNode,
  startNode: StartNode,
  actionNode: ActionNode,
  conditionalNode: ConditionalNode,
  loop: LoopNode,
  endloop: EndLoopNode
};

const edgeTypes = {
  defaultE: DefaultEdge,
  yes: YesEdge,
  no: NoEdge
};
export interface WorkflowParam {
  nodes?: Array<any>;
  edges?: Array<any>;
}

export const Workflow: React.FC<WorkflowParam> = ({
  // nodes,
  // edges,
  ...restProps
}) => {
  const getLayoutedElements = (nodes: Array<any>, edges: Array<any>): any => {};
  const { nodes, edges, currentNode } = useFlowStore(
    (state: RFState) => ({
      nodes: state.nodes,
      edges: state.edges,
      currentNode: state.currentNode
    }),
    shallow
  );
  // debugger;
  useEffect(() => {
    useFlowStore.getState().rearrangeNodePosition();
    return () => {
      useFlowStore.getState().reset();
    };
  }, []);
  return (
    <div className="flex h-dvh w-full flex-row">
      <div className="basis-3/4 flex-1 border border-indigo-500/20">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          // nodesDraggable={false}
          // onNodesChange={onNodesChange}
          // onEdgesChange={onEdgesChange}
          // onConnect={onConnect}
          elementsSelectable={false}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          panOnDrag
          fitView
        >
          <Background
            className="bg-blue-50"
            variant={BackgroundVariant.Cross}
          />
        </ReactFlow>
      </div>
      {currentNode?.id != undefined ? (
        <div className="basis-1/4 border border-indigo-500/20">
          <WorkflowForm title={"Righ Column"} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
