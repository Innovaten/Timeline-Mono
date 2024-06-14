import axios from "axios";
const configModule = require("@repo/config");
import { backOff } from "exponential-backoff";

export async function makeUnauthenticatedRequest(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  body?: Record<string, any>,
  headers?: Record<string, string>
) {
  return backOff(
    () =>
      axios[method](configModule.config.applications.core + url, {
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
        ...(body ? { body: body } : {}),
      }),
    {
      jitter: "full",
      numOfAttempts: 5,
    }
  );
}
