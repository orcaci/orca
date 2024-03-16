import { PageHeader } from "core/components/page_header";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Service } from "service";
import { Endpoint } from "service/endpoint";
import { useTestCaseStore } from "stores/testcase.store";
import { shallow } from "zustand/shallow";

import { PlayCircleIcon } from "@heroicons/react/24/outline";
import { Workflow } from "core/components/flow";
import { flowStateSelector, useFlowStore } from "stores/flow.store";
import { Button } from "@radix-ui/themes";

export interface TestCaseexecutionItem {
  case_id: string;
  execution_order: number;
  id: string;
  kind: string;
  parent_id?: string;
  reference: string;
  type_field: string;
}

export interface TestCaseData {
  id: string;
  name: string;
  description: string;
  app_id: string;
  case_execution: TestCaseexecutionItem[];
}

const blockType: any = {
  Assertion: "actionNode",
  Condition: "conditionalNode",
  YesCase: "yes",
  NoCase: "no"
};
const data = [
  {
    id: "ca037150-1fcd-4cd0-a571-b17c4fd59279",
    execution_order: 1,
    kind: "Reference",
    type_field: "ActionGroup",
    reference: "34dce227-c8cd-4f01-8ed9-68aacc9bde9d",
    parent_id: null,
    case_id: "8b72b6d1-f3a7-4d3e-9dbb-150b5eb0c060",
    children: []
  },
  {
    id: "764cc9dc-48fb-487f-a612-c717c80910d4",
    execution_order: 3,
    kind: "Reference",
    type_field: "Assertion",
    reference: "456dea53-4a87-45d4-b05d-47f531a2f483",
    parent_id: null,
    case_id: "8b72b6d1-f3a7-4d3e-9dbb-150b5eb0c060",
    children: []
  },
  {
    id: "1d70658d-0fb1-4035-afaa-f5544c51dbc6",
    execution_order: 4,
    kind: "SelfReference",
    type_field: "Condition",
    reference: null,
    parent_id: null,
    case_id: "8b72b6d1-f3a7-4d3e-9dbb-150b5eb0c060",
    children: [
      {
        id: "f884e857-7cd7-4412-88f7-f85813545dbe",
        execution_order: 1,
        kind: "SelfReference",
        type_field: "YesCase",
        reference: null,
        parent_id: "1d70658d-0fb1-4035-afaa-f5544c51dbc6",
        case_id: "8b72b6d1-f3a7-4d3e-9dbb-150b5eb0c060",
        children: [
          {
            id: "c48ef0d2-cbeb-4158-8a7c-41cabe99df59",
            execution_order: 1,
            kind: "Reference",
            type_field: "ActionGroup",
            reference: "34dce227-c8cd-4f01-8ed9-68aacc9bde9d",
            parent_id: "f884e857-7cd7-4412-88f7-f85813545dbe",
            case_id: "8b72b6d1-f3a7-4d3e-9dbb-150b5eb0c060",
            children: []
          }
        ]
      },
      {
        id: "873f030f-eea6-48bc-86e0-84a66b86b8a3",
        execution_order: 2,
        kind: "SelfReference",
        type_field: "NoCase",
        reference: null,
        parent_id: "1d70658d-0fb1-4035-afaa-f5544c51dbc6",
        case_id: "8b72b6d1-f3a7-4d3e-9dbb-150b5eb0c060",
        children: []
      }
    ]
  },
  {
    id: "80b11882-c23f-4b46-9349-f6b194010387",
    execution_order: 2,
    kind: "Reference",
    type_field: "ActionGroup",
    reference: "8a05b852-e46c-4a37-b745-b30ba725179b",
    case_id: "8b72b6d1-f3a7-4d3e-9dbb-150b5eb0c060",
    children: []
  }
];

export function TestCasePage() {
  const { appId = "", testCaseId = "" } = useParams();
  const [dataSource, setDataSource] = useState([] as any);
  // const [nodes, setNode] = useState([] as any);
  // const [edges, setEdges] = useState([] as any);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    setEdges,
    rearrangeNodePosition,
    setGraph
  } = useFlowStore(flowStateSelector, shallow);

  const fetchTestCase = async () => {
    await Service.get(`${Endpoint.v1.case.itemList(appId, testCaseId)}`)
      .then((caseblock) => {
        setDataSource(caseblock);
        setGraph(caseblock.case_execution || []);
      })
      .finally(() => {});
  };

  // const processNode = (
  //   item: any,
  //   nodes: Array<any>,
  //   edges: Array<any>,
  //   derivedEdge: any = undefined
  // ) => {
  //   let _blockType = blockType[item.type_field] || "actionNode";
  //   if (derivedEdge != undefined) {
  //     edges.push({
  //       ...derivedEdge,
  //       id: `${derivedEdge?.id}_to_${_blockType}${item.id}`,
  //       type: "defaultE",
  //       target: `${_blockType}${item.id}`
  //     });
  //   }
  //   nodes.push({
  //     id: `${_blockType}${item.id}`,
  //     type: _blockType,
  //     position: { x: 0, y: 300 },
  //     data: { payload: item }
  //   });
  //   if (_blockType == blockType.Assertion) {
  //     edges.push({
  //       id: `edge_${_blockType}_${item.id}`,
  //       type: "defaultE",
  //       source: `${_blockType}${item.id}`,
  //       target: `addBlock${item.id}`
  //     });
  //     nodes.push({
  //       id: `addBlock${item.id}`,
  //       type: "newNode",
  //       position: { x: 0, y: 0 },
  //       data: {}
  //     });
  //     derivedEdge = {
  //       id: `edge_newNode_${_blockType}_${item.id}`,
  //       type: "defaultE",
  //       source: `addBlock${item.id}`
  //     };
  //   } else if (_blockType == blockType.Condition) {
  //     // looping child action
  //     let child = item.children;
  //     if (child != undefined && child.length > 0) {
  //       // generateNodeAndEdge(child, )
  //       child.map((child_item: any, _child_index: number) => {
  //         let field_type = blockType[child_item.type_field] || "actionNode";

  //         nodes.push({
  //           id: `addBlock${field_type}${child_item.id}`,
  //           type: "newNode",
  //           position: { x: 0, y: 0 },
  //           data: {}
  //         });

  //         edges.push({
  //           id: `edge_nde_${field_type}_${child_item.id}`,
  //           type: field_type,
  //           sourceHandle: field_type,
  //           source: `${_blockType}${item.id}`,
  //           target: `addBlock${field_type}${child_item.id}`
  //         });
  //         derivedEdge = {
  //           id: `edge_newNode_${field_type}_${child_item.id}`,
  //           type: "defaultE",
  //           source: `addBlock${field_type}${child_item.id}`
  //         };
  //         // derivedEdge = {
  //         //   id: `edge_newNode_${field_type}_${item.id}`,
  //         //   type: blockType[field_type],
  //         //   sourceHandle: blockType[field_type],
  //         //   source: `addBlock${item.id}`
  //         // };
  //         let _derivedEdge = generateNodeAndEdge(
  //           child_item.children,
  //           nodes,
  //           edges,
  //           derivedEdge
  //         );

  //         edges.push({
  //           ..._derivedEdge,
  //           id: `${_derivedEdge?.id}_to_${field_type}${item.id}`,
  //           type: "defaultE",
  //           target: `addBlock_endBlockConstion_${item.id}`
  //         });
  //       });
  //     }

  //     nodes.push({
  //       id: `addBlock_endBlockConstion_${item.id}`,
  //       type: "newNode",
  //       position: { x: 0, y: 0 },
  //       data: {}
  //     });
  //   }

  //   let child = item.children;
  //   if (child != undefined && child.length > 0) {
  //     // generateNodeAndEdge(child, )
  //   }
  //   return derivedEdge;
  // };
  // const generateNodeAndEdge = (
  //   input: Array<any>,
  //   nodes: Array<any>,
  //   edges: Array<any>,
  //   derivedEdge: any = undefined
  // ) => {
  //   input.map((item: any, index: number) => {
  //     derivedEdge = processNode(item, nodes, edges, derivedEdge);
  //   });
  //   return derivedEdge;
  // };
  /**
   * Added the Only the new node here for the New Workflow
   */
  // const addNewNode = (nodes: Array<any>, edges: Array<any>) => {
  //   nodes.push({
  //     id: "addNode",
  //     type: "newNode",
  //     position: { x: 0, y: 30 },
  //     data: {}
  //   });
  //   nodes.push({
  //     id: "intial",
  //     type: "actionNode",
  //     position: { x: 0, y: 30 },
  //     data: {}
  //   });
  // };

  // const constructWorkflow = (caseblock: any) => {
  //   // let nodes: Array<any> = [];
  //   // let edges: Array<any> = [];
  //   // let currentEdge: any = undefined;
  //   // generateNodeAndEdge(caseblock.case_execution || [], nodes, edges);
  //   // if (nodes.length == 0) {
  //   //   addNewNode(nodes, edges);
  //   // }
  //   // // console.log("edge");
  //   // // console.log(edges);
  //   // // console.log("node");
  //   // // console.log(JSON.parse(JSON.stringify(nodes)));
  //   // setNodes(nodes);
  //   // setEdges(edges);
  //   // rearrangeNodePosition();
  // };

  useEffect(() => {
    fetchTestCase();
  }, [appId]);

  const { name, hasData } = useTestCaseStore(
    (state) => ({ name: state.name, hasData: state.case_execution.length > 0 }),
    shallow
  );

  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    Service.post(`${Endpoint.v1.case.run(appId, testCaseId)}`).finally(() =>
      setIsRunning(false)
    );
  };

  return (
    <>
      <PageHeader
        backIcon
        title={name}
        extra={
          <div className=" flex items-center gap-3">
            <Button
              variant="soft"
              className="flex items-center gap-3"
              onClick={handleRun}
              color="indigo"
            >
              <PlayCircleIcon className="size-4" /> Dry Run
            </Button>
          </div>
        }
      />
      <Workflow></Workflow>
    </>
  );
}
