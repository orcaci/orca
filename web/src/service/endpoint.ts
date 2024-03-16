export const Endpoint = {
  v1: {
    auth: {
      login: "/api/v1/auth/signin"
    },
    admin: {
      getUsers: "/api/v1/admin/user/",
      createUser: "/api/v1/admin/user/",
      getUser: (userId: string) => `/api/v1/admin/user/${userId}`,
      updateUser: (userId: string) => `/api/v1/admin/user/${userId}`,
      deleteUser: (userId: string) => `/api/v1/admin/user/${userId}`,
      getRoles: "/api/v1/admin/role/",
      createRole: "/api/v1/admin/role/"
    },
    application: {
      getApplications: "/api/v1/app",
      createApplication: "/api/v1/app"
    },
    suite: {
      list: (appId: string) => `/api/v1/app/${appId}/suite`,
      create: (appId: string) => `/api/v1/app/${appId}/suite`,
      update: (appId: string, suiteId: string) =>
        `/api/v1/app/${appId}/suite/${suiteId}`,
      delete: (appId: string, suiteId: string) =>
        `/api/v1/app/${appId}/suite/${suiteId}`,
      itemList: (appId: string, suiteId: string) =>
        `/api/v1/app/${appId}/suite/${suiteId}/detail`,
      itemCreate: (appId: string, suiteId: string) =>
        `/api/v1/app/${appId}/suite/${suiteId}/detail`
    },
    case: {
      list: (appId: string) => `/api/v1/app/${appId}/case`,
      create: (appId: string) => `/api/v1/app/${appId}/case`,
      update: (appId: string, caseId: string) =>
        `/api/v1/app/${appId}/case/${caseId}`,
      delete: (appId: string, caseId: string) =>
        `/api/v1/app/${appId}/case/${caseId}`,
      block: {
        list: (appId: string, caseId: string) =>
          `/api/v1/app/${appId}/case/${caseId}/block`,
        create: (appId: string, caseId: string, index?: number) =>
          index
            ? `/api/v1/app/${appId}/case/${caseId}/block?index=${index}`
            : `/api/v1/app/${appId}/case/${caseId}/block`
      },
      get: (appId: string, caseId: string) =>
        `/api/v1/app/${appId}/case/${caseId}`,
      itemList: (appId: string, caseId: string) =>
        `/api/v1/app/${appId}/case/${caseId}/detail`,
      itemCreate: (appId: string, caseId: string) =>
        `/api/v1/app/${appId}/case/${caseId}/insert`,
      batchUpdate: (appId: string, caseId: string) =>
        `/api/v1/app/${appId}/case/${caseId}/batch`,
      updateCaseBlock: (appId: string, caseId: string, blockId: string) =>
        `/api/v1/app/${appId}/case/${caseId}/block/${blockId}`,
      insertBlock: (appId: string, caseId: string, index?: number) =>
        index
          ? `/api/v1/app/${appId}/case/${caseId}/insert?index=${index}`
          : `/api/v1/app/${appId}/case/${caseId}/insert`,
      run: (appId: string, caseId: string) =>
        `/api/v1/app/${appId}/case/${caseId}/run`
    },
    group: {
      getList: (appId: string) => `/api/v1/app/${appId}/group`,
      create: (appId: string) => `/api/v1/app/${appId}/group`,
      update: (appId: string, groupId: string) =>
        `/api/v1/app/${appId}/group/${groupId}`,
      delete: (appId: string, groupId: string) =>
        `/api/v1/app/${appId}/group/${groupId}`
    },
    datatable: {
      create: (appId: string) => `/api/v1/app/${appId}/datatable`,
      getList: (appId: string) => `/api/v1/app/${appId}/datatable`,
      delete: (appId: string, datatableId: string) =>
        `/api/v1/app/${appId}/datatable/${datatableId}`,
      view: {
        getDetail: (appId: string, datatableId: string) =>
          `/api/v1/app/${appId}/datatable/${datatableId}`,
        batchDataUpdate: (appId: string, datatableId: string) =>
          `/api/v1/app/${appId}/datatable/${datatableId}/data/batch`,
        createField: (appId: string, datatableId: string) =>
          `/api/v1/app/${appId}/datatable/${datatableId}/field`,
        createNewRow: (appId: string, datatableId: string) =>
          `/api/v1/app/${appId}/datatable/${datatableId}`,
        getItemList: (appId: string, datatableId: string) =>
          `/api/v1/app/${appId}/datatable/${datatableId}/item`
      }
    },
    action: {
      batch: (appId: string, groupId: string) =>
        `/api/v1/app/${appId}/group/${groupId}/action/batch`,
      list: (appId: string, groupId: string) =>
        `/api/v1/app/${appId}/group/${groupId}/action`,
      create: (appId: string, groupId: string) =>
        `/api/v1/app/${appId}/group/${groupId}/action`,
      update: (appId: string, groupId: string, actionId: string) =>
        `/api/v1/app/${appId}/group/${groupId}/action/${actionId}`,
      delete: (appId: string, groupId: string, actionId: string) =>
        `/api/v1/app/${appId}/group/${groupId}/action/${actionId}`
    },
    history: {
      list: (appId: string) => `/api/v1/app/${appId}/history`
    }
  }
};
