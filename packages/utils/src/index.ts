import { _getToken, _setToken, _clearToken, _getUser, _setUser } from "./auth-token";
import { cn } from "./cn";

import { useLoading, useDialog, useMovileNavigation } from "./hooks";

import { fadeParent, fadeParentAndReplacePage } from "./frontend-shenanigans";
import { makeUnauthenticatedRequest, makeAuthenticatedRequest } from "./axios";
import { validPhoneNumber } from "./phone";

export {
  // Auth Tokens
  _getToken,
  _setToken,
  _clearToken,

  // Session user object
  _getUser,
  _setUser,

  // Phone Numbers
  validPhoneNumber,

  // Tailwind Classname util
  cn,

  //Frontend Shenanigans
  fadeParent,
  fadeParentAndReplacePage,

  // Custom Hooks

  useDialog,
  // Common
  useLoading,
  useMovileNavigation,


  // Fetch Requests 
  makeUnauthenticatedRequest,
  makeAuthenticatedRequest,
};
