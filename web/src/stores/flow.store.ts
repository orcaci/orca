import { graphlib, layout } from "@dagrejs/dagre";
import {
  Connection,
  Edge,
  EdgeChange,
  MarkerType,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges
} from "reactflow";
import { create } from "zustand";


export const flowStateSelector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  graph: state.graph,
  currentNode: state.currentNode,
  setGraph: state.setGraph,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  rearrangeNodePosition: state.rearrangeNodePosition,
  setCurrentNode: state.setCurrentNode,
  reset: state.reset
});

export type RFState = {
  nodes: Node<any>[];
  edges: Edge[];
  graph: any[];
  currentNode: any;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setGraph: (graph: any[]) => void;
  rearrangeNodePosition: () => void;
  addNewNode: (nodes: Node[]) => void;
  setCurrentNode: (node: any) => void;
  reset: () => void;
};
const intialStoreValue = {
  graph: [],
  nodes: [],
  edges: [],
  currentNode: {}
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useFlowStore = create<RFState>((set, get) => ({
  ...intialStoreValue,

  reset: () => {
    set({ ...intialStoreValue });
  },

  setCurrentNode: (node: any) => {
    set({ currentNode: node });
  },

  setGraph: (graph: any[]) => {
    set({ graph });
    let nodes: Array<any> = [];
    let edges: Array<any> = [];
    generateNodeAndEdge(graph || [], nodes, edges);
    set({ nodes, edges });
    get().rearrangeNodePosition();
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges)
    });
  },
  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },
  rearrangeNodePosition: () => {
    const dagreGraph = new graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    let nodes = get().nodes;
    let edges = get().edges;
    if (nodes.length == 0) return;
    dagreGraph.setGraph({
      rankdir: "TB",
      ranker: "longest-path",
      nodesep: 500,
      edgesep: 0,
      marginx: 30,
      marginy: 20,
      ranksep: 60
    });

    let sizeMatrix: any = {
      newNode: { width: 28, height: 30 },
      actionNode: { width: 384, height: 40 },
      conditionalNode: { width: 384, height: 40 },
      endloop: { width: 28, height: 30 },
      loop: { width: 384, height: 40 }
    };

    nodes.forEach((node: any) => {
      let nodeType: string = node["type"];
      let wxh: any = {};
      Object.assign(wxh, sizeMatrix[nodeType] || { width: 400, height: 100 });
      dagreGraph.setNode(node.id, wxh);
    });

    edges
      .filter((item) => !item.id.startsWith("edge_continue"))
      .forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target, { minlen: 1 });
      });

    layout(dagreGraph);
    dagreGraph.graph();


    let resultNode: Array<any> = [];
    nodes.forEach((node: any) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = "top";
      node.sourcePosition = "bottom";
      node.position = {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y
      };
      resultNode.push(node);
      return node;
    });
    set({ nodes, edges });
    return { nodes: resultNode, edges: edges };
  },
  addNewNode: (nodes: Node[]) => {
    set({ nodes: [] });
  }
}));

const blockType: any = {
  Assertion: "actionNode",
  Condition: "conditionalNode",
  Loop: "loop",
  YesCase: "yes",
  NoCase: "no"
};

const processNode = (
  item: any,
  nodes: Array<any>,
  edges: Array<any>,
  derivedEdge: any = undefined,
  parentID: any = undefined
) => {
  let _blockType = blockType[item.type_field] || "actionNode";
  if (derivedEdge != undefined) {
    edges.push({
      ...derivedEdge,
      id: `${derivedEdge?.id}_to_${_blockType}${item.id}`,
      type: "defaultEdge",
      target: `${_blockType}${item.id}`
    });
  }
  nodes.push({
    id: `${_blockType}${item.id}`,
    type: _blockType,
    position: { x: 0, y: 300 },
    data: { payload: item }
  });
  if (_blockType == blockType.Assertion) {
    edges.push({
      id: `edge_${_blockType}_${item.id}`,
      type: "defaultEdge",
      source: `${_blockType}${item.id}`,
      target: `addBlock${item.id}`
    });
    nodes.push({
      id: `addBlock${item.id}`,
      type: "newNode",
      position: { x: 0, y: 0 },
      data: {
        execution_order: item.execution_order + 1,
        parent_id: parentID,
        case_id: item.case_id
      }
    });
    derivedEdge = {
      id: `edge_newNode_${_blockType}_${item.id}`,
      type: "defaultEdge",
      source: `addBlock${item.id}`
    };
  } else if (_blockType == blockType.Loop) {
    let child = item.children;

    edges.push({
      id: `edge_begin_${_blockType}_${item.id}`,
      type: "no",
      source: `${_blockType}${item.id}`,
      target: `addBlock_${_blockType}${item.id}`,

      markerEnd: { type: MarkerType.ArrowClosed }
    });

    nodes.push({
      id: `addBlock_${_blockType}${item.id}`,
      type: "newNode",
      position: { x: 0, y: 0 },
      data: {
        execution_order: 1,
        parent_id: item.id,
        case_id: item.case_id
      }
    });

    derivedEdge = {
      id: `edge_child_${_blockType}_${item.id}`,
      type: "defaultEdge",
      source: `addBlock_${_blockType}${item.id}`
    };

    derivedEdge = generateNodeAndEdge(
      child,
      nodes,
      edges,
      derivedEdge,
      item.id
    );

    edges.push({
      ...derivedEdge,
      id: `${derivedEdge?.id}_to_end_${_blockType}${item.id}`,
      type: "defaultEdge",
      target: `endloop${item.id}`
    });
    nodes.push({
      id: `endloop${item.id}`,
      type: "endloop",
      position: { x: 0, y: 0 },
      data: {
        execution_order: item.execution_order + 1,
        parent_id: parentID,
        case_id: item.case_id
      }
    });

    edges.push({
      id: `edge_continue_${_blockType}_${item.id}`,
      type: "smoothstep",
      sourceHandle: "continue",
      targetHandle: "continue",
      source: `endloop${item.id}`,
      target: `${_blockType}${item.id}`,

      markerEnd: { type: MarkerType.ArrowClosed }
    });

    edges.push({
      id: `edge_end_${_blockType}_${item.id}`,
      type: "defaultEdge",
      sourceHandle: "end",
      source: `endloop${item.id}`,
      target: `addBlock${item.id}`
    });

    nodes.push({
      id: `addBlock${item.id}`,
      type: "newNode",
      position: { x: 0, y: 0 },
      data: {
        execution_order: item.execution_order + 1,
        parent_id: parentID,
        case_id: item.case_id
      }
    });
    derivedEdge = {
      id: `edge_newNode_${_blockType}_${item.id}`,
      type: "defaultEdge",
      source: `addBlock${item.id}`
    };
  } else if (_blockType == blockType.Condition) {
    let child = item.children;
    if (child != undefined && child.length > 0) {
      child.map((child_item: any, _child_index: number) => {
        let field_type = blockType[child_item.type_field] || "actionNode";

        nodes.push({
          id: `addBlock${field_type}${child_item.id}`,
          type: "newNode",
          position: { x: 0, y: 0 },
          data: {
            execution_order: 1,
            parent_id: child_item.id,
            case_id: item.case_id
          }
        });

        edges.push({
          id: `edge_nde_${field_type}_${child_item.id}`,
          type: field_type,
          sourceHandle: field_type,
          source: `${_blockType}${item.id}`,
          target: `addBlock${field_type}${child_item.id}`
        });
        derivedEdge = {
          id: `edge_newNode_${field_type}_${child_item.id}`,
          type: "defaultEdge",
          source: `addBlock${field_type}${child_item.id}`
        };
        let _derivedEdge = generateNodeAndEdge(
          child_item.children,
          nodes,
          edges,
          derivedEdge,
          child_item.id
        );

        edges.push({
          ..._derivedEdge,
          id: `${_derivedEdge?.id}_to_${field_type}${item.id}`,
          type: "defaultEdge",
          target: `addBlock_endBlockConstion_${item.id}`
        });
      });
    }

    nodes.push({
      id: `addBlock_endBlockConstion_${item.id}`,
      type: "newNode",
      position: { x: 0, y: 0 },
      data: {
        execution_order: item.execution_order + 1,
        parent_id: parentID,
        case_id: item.case_id
      }
    });
    derivedEdge = {
      id: `edge_newNode_${_blockType}_${item.id}`,
      type: "defaultEdge",
      source: `addBlock_endBlockConstion_${item.id}`
    };
  }
  return derivedEdge;
};
const generateNodeAndEdge = (
  input: Array<any>,
  nodes: Array<any>,
  edges: Array<any>,
  derivedEdge: any = undefined,
  parentID: any = undefined
) => {
  input.map((item: any, index: number) => {
    derivedEdge = processNode(item, nodes, edges, derivedEdge, parentID);
  });

  if (parentID == undefined && nodes.length == 0) {
    nodes.push({
      id: `addBlock_start`,
      type: "newNode",
      position: { x: 0, y: 0 },
      data: {
        execution_order: 1,
        parent_id: parentID,
        case_id: "case_id"
      }
    });
  }
  return derivedEdge;
};
