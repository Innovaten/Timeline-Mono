import { _getToken, _setToken, _clearToken, _getUser, _setUser } from "./auth-token";
import { cn } from "./cn";

import { useLoading, useDialog, useMovileNavigation, useCountdown, useFileUploader, useToggleManager } from "./hooks";

import { fadeParent, fadeParentAndReplacePage, MultiPage } from "./frontend-shenanigans";
import { makeUnauthenticatedRequest, makeAuthenticatedRequest, abstractAuthenticatedRequest, abstractUnauthenticatedRequest } from "./axios";
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
  MultiPage,

  // Custom Hooks

  useDialog,
  // Common
  useLoading,
  useCountdown,
  useMovileNavigation,
  useFileUploader,
  useToggleManager,


  // Fetch Requests 
  makeUnauthenticatedRequest,
  makeAuthenticatedRequest,
  abstractAuthenticatedRequest,
  abstractUnauthenticatedRequest,
  
};
