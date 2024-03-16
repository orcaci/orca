import { RequestParams } from "../interface/request";

function createRequest(url: string, options?: RequestParams) {
  const reqOption: any = {};
  if (options) {
    reqOption.url = url;
    reqOption.method = options.method;
    if (reqOption.method !== "GET" && options.body) {
      if (typeof options.body !== "string") {
        reqOption.body = JSON.stringify(options.body);
      } else {
        reqOption.body = options.body;
      }
    }
    reqOption.headers = {
      "Content-Type": "application/json"
    };
  }
  return new Request(url, reqOption);
}

function sendRequest(url: string, options?: RequestParams) {
  const request = createRequest(url, options);
  return fetch(request).then((response) => response.json());
}

export const Service = {
  get: async (url: string) => {
    return sendRequest(url);
  },
  post: (url: string, options: any = {}) => {
    options.method = "POST";
    return sendRequest(url, options);
  },
  update: (url: string, options: any = {}) => {
    options.method = "PUT";
    return sendRequest(url, options);
  },
  delete: (url: string, options: any = {}) => {
    options.method = "DELETE";
    return sendRequest(url, options);
  }
};
