import { routeTree } from "./routeTree.gen";
import { create } from "zustand";
import { ILMSContextAction, ILMSContextState } from "./context";
import { RouterProvider, createRouter } from "@tanstack/react-router";


export const useLMSContext = create<ILMSContextState & ILMSContextAction>((set) => ({
  // State
  user: null,
  token: null,
  
  // Actions 
  setUser: (user) => set((state: any) => ({ ...state, user: user }) ),
  setToken: (token) => set((state: any) => ({ ...state, token: token }) ),
}))

const router = createRouter({ 
  routeTree,
  context: {
    user: null
  },
  defaultNotFoundComponent: () => {
    return (
      <>
        <div className="top-0 left-0 grid place-items-center fixed w-screen h-screen bg-white">
          <div className='w-fit h-fit'>
              <div
                  className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
              ></div>
          </div>
        </div>
      </>
    )
  },
  defaultErrorComponent: () => {
    return (
      <>
        <div className="top-0 left-0 grid place-items-center fixed w-screen h-screen bg-white">
          <div className='w-fit h-fit'>
              <div
                  className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
              ></div>
          </div>
        </div>
      </>
    )
  },
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