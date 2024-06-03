import axios from "axios";
import { config } from "@repo/config";
import { backOff } from "exponential-backoff";

export async function makeUnauthenticatedRequest(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  body?: Record<string, string>,
  headers?: Record<string, string>
) {
  return backOff(
    () =>
      axios[method](config.applications.core + url, {
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
