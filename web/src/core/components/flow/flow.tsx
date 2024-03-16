import ReactFlow, {
  Background,
  Node,
  useEdgesState,
  useNodesState
} from "reactflow";

import { graphlib, layout } from "@dagrejs/dagre";
import { useEffect } from "react";
import "reactflow/dist/style.css";
import { DefaultEdge } from "./edge";
import { NoEdge } from "./edge/no";
import { YesEdge } from "./edge/yes";
import { StartNode } from "./node";
import { ActionNode } from "./node/action";
import { ConditionalNode } from "./node/condition";
import { NewNode } from "./node/new";

const initialNodes: Array<Node> = [
  //   {
  //     id: "1-4640-4afe-a05b-1d0e08ee9594",
  //     position: {
  //       x: 0,
  //       y: -50
  //     },
  //     data: {
  //       label: "1",
  //       payload: {
  //         id: "fcb03ff7-4640-4afe-a05b-1d0e08ee9594",
  //         execution_order: 1,
  //         kind: "Reference",
  //         type_field: "ActionGroup",
  //         reference: "cb2f6a96-effe-4bc7-adae-c45578cd2a56",
  //         parent_id: null,
  //         case_id: "731453aa-95a5-4180-be0d-c211a1e92aad"
  //       }
  //     }
  //   },
  {
    id: "actionNodefcb03ff7-4640-4afe-a05b-1d0e08ee9594",
    type: "actionNode",
    position: {
      x: 0,
      y: 0
    },
    data: {
      payload: {
        id: "fcb03ff7-4640-4afe-a05b-1d0e08ee9594",
        execution_order: 1,
        kind: "Reference",
        type_field: "ActionGroup",
        reference: "cb2f6a96-effe-4bc7-adae-c45578cd2a56",
        parent_id: null,
        case_id: "731453aa-95a5-4180-be0d-c211a1e92aad"
      }
    }
  },
  //   {
  //     id: "addNewfcb03ff7-4640-4afe-a05b-1d0e08ee9594",
  //     type: "newNode",
  //     position: {
  //       x: 178,
  //       y: 150
  //     },
  //     data: {
  //       payload: {
  //         id: "d3fa5829-a393-4398-b12f-678ffdbb0871",
  //         execution_order: 2,
  //         kind: "Reference",
  //         type_field: "Assertion",
  //         reference: "150d0ae1-af8a-4d03-bafd-299fdc99ffde",
  //         parent_id: null,
  //         case_id: "731453aa-95a5-4180-be0d-c211a1e92aad"
  //       }
  //     }
  //   },
  {
    id: "actionNoded3fa5829-a393-4398-b12f-678ffdbb0871",
    type: "actionNode",
    position: {
      x: 0,
      y: 300
    },
    data: {
      payload: {
        id: "d3fa5829-a393-4398-b12f-678ffdbb0871",
        execution_order: 2,
        kind: "Reference",
        type_field: "Assertion",
        reference: "150d0ae1-af8a-4d03-bafd-299fdc99ffde",
        parent_id: null,
        case_id: "731453aa-95a5-4180-be0d-c211a1e92aad"
      }
    }
  }
  //   {
  //     id: "addNewd3fa5829-a393-4398-b12f-678ffdbb0871",
  //     type: "newNode",
  //     position: {
  //       x: 178,
  //       y: 450
  //     },
  //     data: {
  //       payload: {
  //         id: "d3fa5829-a393-4398-b12f-678ffdbb0871",
  //         execution_order: 2,
  //         kind: "Reference",
  //         type_field: "Assertion",
  //         reference: "150d0ae1-af8a-4d03-bafd-299fdc99ffde",
  //         parent_id: null,
  //         case_id: "731453aa-95a5-4180-be0d-c211a1e92aad"
  //       }
  //     }
  //   }
];
const initialEdges = [
  {
    id: "actionNodefcb03ff7-4640-4afe-a05b-1d0e08ee9594_to_addNewfcb03ff7-4640-4afe-a05b-1d0e08ee9594",
    type: "defaultE",
    source: "actionNodefcb03ff7-4640-4afe-a05b-1d0e08ee9594",
    target: "actionNoded3fa5829-a393-4398-b12f-678ffdbb0871"
  }
  //   {
  //     id: "actionNodefcb03ff7-4640-4afe-a05b-1d0e08ee9594_to_addNewfcb03ff7-4640-4afe-a05b-1d0e08ee9594",
  //     type: "defaultE",
  //     source: "actionNodefcb03ff7-4640-4afe-a05b-1d0e08ee9594",
  //     target: "addNewfcb03ff7-4640-4afe-a05b-1d0e08ee9594"
  //   },
  //   {
  //     id: "actionNodefcb03ff7-4640-4afe-a05b-1d0e08ee9594_to_actionNoded3fa5829-a393-4398-b12f-678ffdbb0871",
  //     type: "defaultE",
  //     source: "addNewfcb03ff7-4640-4afe-a05b-1d0e08ee9594",
  //     target: "actionNoded3fa5829-a393-4398-b12f-678ffdbb0871"
  //   },
  //   {
  //     id: "actionNoded3fa5829-a393-4398-b12f-678ffdbb0871_to_addNewd3fa5829-a393-4398-b12f-678ffdbb0871",
  //     type: "defaultE",
  //     source: "actionNoded3fa5829-a393-4398-b12f-678ffdbb0871",
  //     target: "addNewd3fa5829-a393-4398-b12f-678ffdbb0871"
  //   }
];

let initNode = [
  {
    id: "1",
    type: "conditionalNode",
    position: {
      x: 0,
      y: 0
    },
    data: {
      label: "actionNode 1"
    }
  },
  {
    id: "2",
    type: "actionNode",
    position: {
      x: 0,
      y: 0
    },
    data: {
      label: "actionNode 2"
    }
  },
  {
    id: "3",
    type: "actionNode",
    position: {
      x: 0,
      y: 0
    },
    data: {
      label: "actionNode 3"
    }
  },
  {
    id: "4",
    type: "conditionalNode",
    position: {
      x: 0,
      y: 0
    },
    data: {
      label: "actionNode 4"
    }
  },
  {
    id: "5",
    type: "actionNode",
    position: {
      x: 0,
      y: 0
    },
    data: {
      label: "actionNode 5"
    }
  },
  {
    id: "6",
    type: "actionNode",
    position: {
      x: 0,
      y: 0
    },
    data: {
      label: "actionNode 6 he how are you"
    }
  }
];

let initEdge = [
  {
    id: "edge1->2",
    type: "yes",
    target: "2",
    sourceHandle: "yes",
    source: "1"
  },
  {
    id: "edge1->3",
    type: "no",
    sourceHandle: "no",

    target: "3",
    source: "1"
  },
  {
    id: "3->4",
    type: "defaultE",

    target: "4",
    source: "3"
  },
  {
    id: "4->5",
    type: "yes",
    target: "5",
    sourceHandle: "yes",
    source: "4"
  },
  {
    id: "4->6",
    type: "no",
    sourceHandle: "no",

    target: "6",
    source: "4"
  }
];

const nodeTypes = {
  newNode: NewNode,
  startNode: StartNode,
  actionNode: ActionNode,
  conditionalNode: ConditionalNode
};

const edgeTypes = {
  defaultE: DefaultEdge,
  yes: YesEdge,
  no: NoEdge
};

export default function RFlow() {
  const dagreGraph = new graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const getLayoutedElements = (nodes: Array<any>, edges: Array<any>): any => {
    dagreGraph.setGraph({
      rankdir: "TB",
      ranker: "network-simplex",
      marginx: 30,
      marginy: 20
    });

    const nodeWidth = 400;
    const nodeHeight = 100;
    let sizeMatrix: any = {
      newNode: { width: 28, height: 28 },
      actionNode: { width: 74, height: 69 }
    };

    nodes.forEach((node) => {
      let t: string = node["type"];
      let s: any = sizeMatrix[t] || { width: 172, height: 36 };
      console.log("currect value of the width and height ", t, " - ", s);
      s = { width: nodeWidth, height: nodeHeight };
      dagreGraph.setNode(node.id, s);
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
    // dagreGraph.removeEdge
    // dagreGraph.setParent

    layout(dagreGraph);

    console.log("result", "graph", dagreGraph.graph());

    let n: Array<any> = [];
    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      console.log("result", node.id, nodeWithPosition);
      node.targetPosition = "top";
      node.sourcePosition = "bottom";

      //   let t: string = node["type"];
      //   let s: any = sizeMatrix[t] || { width: 172, height: 36 };

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      };
      n.push(node);
      return node;
    });

    return { nodes: n, edges: edges };
  };
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    let result = getLayoutedElements(initNode, initEdge);
    console.log("result", result);
    setNodes(result["nodes"]);
    setEdges(result["edges"]);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        panOnDrag
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
