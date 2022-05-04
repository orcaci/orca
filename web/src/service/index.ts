import { RequestParams } from "../interface/request";

function createRequest(url: any, options?: RequestParams) {
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

function sendRequest(url: String, options?: RequestParams) {
  const request = createRequest(url, options);
  return fetch(request).then((response) => response.json());
}

export const Service = {
  get: async (url: String) => {
    return sendRequest(url);
  },
  post: (url: String, options: any) => {
    options.method = "POST";
    return sendRequest(url, options);
  }
};
