import { _getToken, _setToken, _clearTokens, _getUser, _setUser, _setTokenExpiration, _getTokenExpiration } from "./auth-token";
import { cn } from "./cn";

import { useLoading, useDialog, useMobileNavigation, useCountdown, useFileUploader, useToggleManager } from "./hooks";

import { fadeParent, MultiPage, copyToClipboard } from "./frontend-shenanigans";
import { makeUnauthenticatedRequest, makeAuthenticatedRequest, abstractAuthenticatedRequest, abstractUnauthenticatedRequest } from "./axios";
import { validPhoneNumber } from "./phone";

export {
  // Auth Tokens
  _getToken,
  _setToken,
  _clearTokens,

  // Token expiration
  _setTokenExpiration,
  _getTokenExpiration,

  // Session user object
  _getUser,
  _setUser,

  // Phone Numbers
  validPhoneNumber,

  // Tailwind Classname util
  cn,

  //Frontend Shenanigans
  fadeParent,
  MultiPage,
  copyToClipboard,

  // Custom Hooks

  useDialog,
  // Common
  useLoading,
  useCountdown,
  useMobileNavigation,
  useFileUploader,
  useToggleManager,


  // Fetch Requests 
  makeUnauthenticatedRequest,
  makeAuthenticatedRequest,
  abstractAuthenticatedRequest,
  abstractUnauthenticatedRequest,
  
};
