import { _getToken, _setToken, _clearToken } from "./auth-token";
import { cn } from "./cn";
import useLoading from "./hooks/common/loading.hook";
import { fadeParent, fadeParentAndReplacePage } from "./frontend-shenanigans";
import { makeUnauthenticatedRequest } from "./axios";
import { validPhoneNumber } from "./phone";

export {
  // Auth Tokens
  _getToken,
  _setToken,
  _clearToken,

  // Phone Numbers
  validPhoneNumber,

  // Tailwind Classname util
  cn,

  //Frontend Shenanigans
  fadeParent,
  fadeParentAndReplacePage,

  // Custom Hooks

  // Common
  useLoading,

  // Fetch Requests 
  makeUnauthenticatedRequest,
};
