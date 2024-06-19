import axios from "axios";
import { backOff } from "exponential-backoff";
import { UtilsConfig } from "../config";
import { _getToken } from "./auth-token";

export async function makeUnauthenticatedRequest(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  body?: Record<string, any>,
  headers?: Record<string, string>
) {
  return backOff(
    () =>
      axios[method](UtilsConfig.applications.core + url, {
        ...(headers
          ? {
              headers: {
                ...headers,
                ...(method != "get"
                  ? { "content-type": "application/json" }
                  : {}),
              },
            }
          : {}),
        ...(body ? body : {}),
      }),
    {
      jitter: "full",
      numOfAttempts: 5,
    }
  );
}


export async function makeAuthenticatedRequest(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  body?: Record<string, any>,
  headers?: Record<string, string>
){

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