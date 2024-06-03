import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter, useRouteContext } from "@tanstack/react-router";
import "@repo/ui/index.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { create } from "zustand";
import { ILMSContextAction, ILMSContextState } from "./context";


export const useLMSContext = create<ILMSContextState & ILMSContextAction>((set) => ({
  // State
  user: null,
  token: null,
  
  // Actions 
  setUser: (user) => set((state: any) => ({ ...state, user }) ),
  setToken: (token) => set((state: any) => ({ ...state, token }) )
}))

const router = createRouter({ 
  routeTree
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
