import {Service} from "..";
import {Endpoint} from "../endpoint";

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
    payload: any
    
) => {
    let _suite = Service.post(
        `${Endpoint.v1.suite.create(appId)}`, {
            body: payload
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
        `${Endpoint.v1.suite.delete(appId, suiteId)}`
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

export interface BatchItem {
    id?: string,  //this need to be UUID
    execution_order: number,
    type_field: string, //"TestCase"
    reference: string, //use Test case id
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

// insertSuiteBlock - insert new Block to the Existing suite in application
export const insertSuiteBlock = async (
    appId: string,
    suiteId: string,
    payload: BatchItem
) => {
    let suiteItem = Service.post(
        `${Endpoint.v1.suite.insertSuitBlock(appId, suiteId)}`, {
            body: payload
        }
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

// reorderSuiteBlock - to reorder the block in the suite with new location
export const reorderSuiteBlock = async (
    appId: string,
    suiteId: string,
    blockId: string,
    payload: { location: number }
) => {
    return Service.post(
        `${Endpoint.v1.suite.reorderSuiteBlock(appId, suiteId, blockId)}`, {
            body: payload
        }
    )
        .then((suiteItem) => {
            return suiteItem;
        })
        .catch((error) => {
            console.error("fetch Actions failed with some reason =", error);
            return [];
        });
};


// deleteSuite - will delete block to the application
export const deleteSuiteBlock = async (
    appId: string,
    suiteId: string,
    blockId: string,
) => {
    let suiteItem = Service.delete(
        `${Endpoint.v1.suite.deleteSuiteBlock(appId, suiteId, blockId)}`
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


// dryRun - will trigger dry run for the suite
// this will not run the actual test case but will return the test case
export const dryRun = async (
    appId: string,
    suiteId: string,
) => {
    let dryRun = Service.post(
        `${Endpoint.v1.suite.dryRun(appId, suiteId)}`, {body: {}}
    )
        .then((dryrun) => {
            return dryrun;
        })
        .catch((error) => {
            console.error("fetch Actions failed with some reason =", error);
            return [];
        });
    return dryRun;
};



