import axios, { AxiosPromise, AxiosResponse } from "axios";
import { backOff } from "exponential-backoff";
import { toast } from "sonner";
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

export async function abstractUnauthenticatedRequest(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  body?: Record<string, any>,
  headers?: Record<string, string>,
  callbacks?: {
    onStart?: ()=> void,
    onSuccess?: (data: any) => void,
    onFailure?: (err: any) => void,
    finally?: () => void,
  }
) {

  callbacks?.onStart && callbacks.onStart();

  return makeUnauthenticatedRequest(
    method,
    url,
    body,
    headers
  ).then(res => {
    if(res.data.success){
      callbacks?.onSuccess && callbacks.onSuccess(res.data.data);
    } else {
      callbacks?.onFailure && callbacks.onFailure(res.data.error)
    }
  })
  .catch(err => {
    if(err.message){
      toast.error(err.message)
    } else {
      toast.error(`${err}`)
    }
  })
  .finally(() => {
    callbacks?.finally && callbacks.finally();
  })
}


export async function abstractAuthenticatedRequest(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  body?: Record<string, any>,
  headers?: Record<string, string>,
  callbacks?: {
    onStart?: ()=> void,
    onSuccess: (data: any) => void,
    onFailure?: (err: any) => void,
    finally?: () => void,
  }
) {

  callbacks?.onStart && callbacks.onStart();

  return makeAuthenticatedRequest(
    method,
    url,
    body,
    {
      ...headers,
      authorization: "Bearer " + _getToken()
    }
  ).then(res => {
    if(res.data.success){
      callbacks?.onSuccess && callbacks.onSuccess(res.data.data);
    } else {
      callbacks?.onFailure && callbacks.onFailure(res.data.error)
    }
  })
  .catch(err => {
    if(err.message){
      toast.error(err.message)
    } else {
      toast.error(`${err}`)
    }
  })
  .finally(() => {
    callbacks?.finally && callbacks.finally();
  })
}