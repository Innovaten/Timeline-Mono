import axios, { AxiosPromise, AxiosResponse } from "axios";
import { backOff } from "exponential-backoff";
import { UtilsConfig } from "../config";
import { _getToken } from "./auth-token";

export async function makeUnauthenticatedRequest(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  body?: Record<string, any>,
  headers?: Record<string, string>
): Promise<AxiosResponse> {
  
  let axiosHeaders = {};

  if(headers){
    if( method == 'get') {
        axiosHeaders = headers
    } else {
      axiosHeaders = {
        ...headers,
        "content-type": "application/json"
      }
    }
  }

  return backOff(
    () =>
      axios[method](UtilsConfig.applications.core + url, {
        headers: axiosHeaders,
        ...(body ? body : {}),
      }),
    {
      jitter: "full",
      numOfAttempts: 5,
    }
  );
}

axios.get("./.",{ headers: { } })

export async function makeAuthenticatedRequest(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  body?: Record<string, any>,
  headers?: Record<string, string>
): Promise<AxiosResponse>
{

  // Basically just adds the authentication token
  return makeUnauthenticatedRequest(
    method,
    url,
    body,
    {
      ...headers,
      authorization: "Bearer " + _getToken()
    }
  )

}