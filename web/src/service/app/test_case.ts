import { Service } from "..";
import { Endpoint } from "../endpoint";

// fetchTestCases - will get all the TestCase for specific Application
export const fetchTestCases = async (
  appId: string,
) => {
  let _actions = Service.get(
    `${Endpoint.v1.case.list(appId)}`
  )
    .then((actions) => {
      return actions;
    })
    .catch((error) => {
      console.error("fetch Actions failed with some reason =", error);
      return [];
    });
  return _actions;
};
