import { Service } from "..";
import { Endpoint } from "../endpoint";

// fetchTestSuite - will get all the Test Suite for specific Application
export const fetchTestSuite = async (
  appId: string,
) => {
  let _suites = Service.get(
    `${Endpoint.v1.suite.list(appId)}`
  )
    .then((suites) => {
      return suites;
    })
    .catch((error) => {
      console.error("fetch Actions failed with some reason =", error);
      return [];
    });
  return _suites;
};


// createNewSuit - Will create new Test case to the application
export const createNewSuit = async (
  appId: string,
  name: string,
  desc: string,
) => {
  let _suite = Service.post(
    `${Endpoint.v1.suite.create(appId)}`, {
      body: {name, description: desc}
    }
  )
    .then((suite) => {
      return suite;
    })
    .catch((error) => {
      console.error("fetch Actions failed with some reason =", error);
      return [];
    });
  return _suite;
};


// deleteSuite - will delete block to the application
export const deleteSuite = async (
  appId: string,
  suiteId: string,
) => {
  let suiteItem = Service.delete(
    `${Endpoint.v1.suite.itemList(appId, suiteId)}`
  )
    .then((suiteItem) => {
      return suiteItem;
    })
    .catch((error) => {
      console.error("fetch Actions failed with some reason =", error);
      return [];
    });
  return suiteItem;
};

interface BatchItem {
  id?: string,  //this need to be UUID
  execution_order: number,
  type: string, //"TestCase"
  reference: string, //UUid
  suite_id: string,
}

// batchUpdate - will batch block update new Test Suite to the application
export const batchUpdate = async (
  appId: string,
  suiteId: string,
  payload: Array<BatchItem>
) => {
  let batchItems = Service.post(
    `${Endpoint.v1.suite.batchUpdate(appId, suiteId)}`, {
      body: payload
    }
  )
    .then((batchItems) => {
      return batchItems;
    })
    .catch((error) => {
      console.error("fetch Actions failed with some reason =", error);
      return [];
    });
  return batchItems;
};



// listBlock - will list block for the speficed application and suiteId
export const fetchSuiteItems = async (
  appId: string,
  suiteId: string,
) => {
  let suiteItem = Service.get(
    `${Endpoint.v1.suite.itemList(appId, suiteId)}`
  )
    .then((suiteItem) => {
      return suiteItem;
    })
    .catch((error) => {
      console.error("fetch Actions failed with some reason =", error);
      return [];
    });
  return suiteItem;
};



