import { produce } from "immer";
import { Service } from "service";
import { Endpoint } from "service/endpoint";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

const initStore = {
  case_execution: []
};

const createActionGroup = async (appId, uuid) => {
  return await Service.post(`${Endpoint.v1.group.create(appId)}`, {
    body: {
      app_id: appId,
      description: "",
      name: `Assertion-${uuid}`,
      type_field: "Assertion"
    }
  });
};

const createAction = async (appId, actionGroup) => {
  return await Service.post(
    `${Endpoint.v1.action.create(appId, actionGroup.id)}`,
    {
      body: {
        action_group_id: actionGroup.id,
        data: null,
        data_kind: null,
        data_value: "",
        description: null,
        execution_order: 1,
        id: uuidv4(),
        kind: "Click",
        target: null,
        target_kind: "Xpath",
        target_value: ""
      }
    }
  );
};

// function insertObjectinArray(arr, newObj) {
//   const index = arr.findIndex(
//     (obj) => newObj.execution_order <= obj.execution_order
//   );
//   if (index === -1) {
//     arr.push(newObj);
//   } else {
//     arr.splice(index, 0, newObj);
//     for (let i = index + 1; i < arr.length; i++) {
//       arr[i].execution_order++;
//     }
//   }
//   return arr;
// }

const createWithImmer = (storeCreator) =>
  create((originalSet, originalGet) =>
    storeCreator((fn) => originalSet(produce(fn)), originalGet)
  );

export const useTestCaseStore = createWithImmer((setState, getState) => ({
  ...initStore,

  loadData: async (appId, testCaseId) => {
    await Service.get(Endpoint.v1.case.itemList(appId, testCaseId)).then(
      (data) => {
        setState(() => data);
      }
    );
  },

  addBlock: async (index, type_field) => {
    const execution_order = index + 1;
    const appId = getState().app_id;
    const caseId = getState().id;
    const uuid = uuidv4();
    let reference = null;

    if (type_field === "Assertion") {
      const actionGroup = await createActionGroup(appId, uuid);
      await createAction(appId, actionGroup);
      reference = actionGroup.id;
    }

     Service.post(`${Endpoint.v1.case.block.create(appId, caseId, execution_order)}`, {
      body: {
        type_field: type_field,
        case_id: caseId,
        parent_id: null,
        kind: "Reference",
        execution_order,
        reference,
        id: uuid
      }
    }).finally(()=>{
       getState().loadData(appId, caseId)
    })

    // setState((state) => {
    //   state.case_execution = insertObjectinArray([...state.case_execution], {
    //     type_field: type_field,
    //     case_id: state.id,
    //     parent_id: null,
    //     kind: "Reference",
    //     execution_order,
    //     reference,
    //     id: uuid
    //   });
    // });

    // getState().save();

   
  },

  updateActionBlock: async ({ actionId, groupId }) => {
    const blockIndex = getState().case_execution.findIndex(
      (block) => block.id === actionId
    );
    const appId = getState().app_id;
    const caseId = getState().id;
    await Service.post(
      `${Endpoint.v1.case.updateCaseBlock(appId, caseId, actionId)}`,
      {
        body: {
          ...getState().case_execution[blockIndex],
          reference: groupId
        }
      }
    );
  },

  save: async () => {
    const appId = getState().app_id;
    const caseId = getState().id;
    await Service.post(Endpoint.v1.case.batchUpdate(appId, caseId), {
      body: getState().case_execution
    });
  }
}));
