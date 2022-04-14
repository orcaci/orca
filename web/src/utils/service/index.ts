import { RequestParams } from "./interface";

export const Service = {
  get: (requestParams: RequestParams) => {
    return makeRequest(requestParams);
  }
};

function makeRequest({ url, method, headers, body }: RequestParams) {
  return fetch(url, {
    method,
    headers: new Headers(headers),
    body: JSON.stringify(body)
  }).then((response) => response.json());
}
