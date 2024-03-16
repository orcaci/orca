import { Service } from "..";
import { Endpoint } from "../endpoint";

// fetchActions - will get all the Action for specific action group
export const fetchActions = async (
  appId: string,
  actionGroupId: string,
  callback: (actions: any) => any = () => {}
) => {
  let _actions = await Service.get(
    `${Endpoint.v1.action.list(appId, actionGroupId)}`
  )
    .then((actions) => {
      callback(actions);
      return actions;
    })
    .catch((error) => {
      console.log("fetch Actions failed with some reason =", error);
      return [];
    });
  return _actions;
};

/**
 * saveBatch - will save all the value from the Action Groups Actions
 * @param appId App ID
 * @param actionGroupId
 * @param source
 */
export const saveBatch = async (
  appId: string,
  actionGroupId: string,
  source: any
) => {
  await Service.post(`${Endpoint.v1.action.batch(appId, actionGroupId)}`, {
    body: source
  }).then((actions) => {
    console.log(actions);
    return actions;
  });
};
