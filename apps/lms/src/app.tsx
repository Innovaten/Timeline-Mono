import { routeTree } from "./routeTree.gen";
import { create } from "zustand";
import { ILMSContextAction, ILMSContextState } from "./context";
import { RouterProvider, createRouter } from "@tanstack/react-router";


export const useLMSContext = create<ILMSContextState & ILMSContextAction>((set) => ({
  // State
  user: null,
  
  // Actions 
  setUser: (user) => set((state: any) => ({ ...state, user: user }) ),
}))

const router = createRouter({ 
  routeTree,
  context: {
    user: null
  }
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App(){
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}