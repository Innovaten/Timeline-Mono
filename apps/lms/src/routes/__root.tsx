import { createRootRouteWithContext, Link, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { _getToken, _getUser, _setUser, makeAuthenticatedRequest, _clearTokens, _getTokenExpiration } from '@repo/utils';
import SidebarComponent from '../components/Sidebar.component';
import { Toaster } from 'sonner';
import { IUserDoc } from "@repo/models";
import { useLMSContext } from '../app';
import { useMemo } from 'react';

export interface ConsoleRouterContext {
  user: IUserDoc | null,
}

export const Route = createRootRouteWithContext<ConsoleRouterContext>()({
  component: RootPage,
  beforeLoad: ( {  location }) => {
    const authToken = _getToken()
    const userToken = _getUser()
    const expirationDate = _getTokenExpiration()
    const userTokensAreNotSet = !authToken || !userToken || ( new Date(expirationDate ?? "").getTime() < new Date().getTime() ) 
    const isNotLoginPage = !location.href.startsWith('/login') && !location.href.startsWith('/register')

    if(isNotLoginPage && userTokensAreNotSet ){ // If we don't know you
      if(new Date(expirationDate ?? "").getTime() < new Date().getTime()){
        _clearTokens()
      }
    throw redirect ({
        to: "/login", 
        search: { 
          destination: "", 
          ...location.search 
        } 
      })
    } else if( location.href.startsWith('register')){
      return;
    } else if(authToken && !userToken){ //  You have a token but user context is not set
        makeAuthenticatedRequest(
          "get",
          '/api/v1/auth/verify-token'
        ).then(res => {
          if(res.data.success){
            _setUser(res.data.data);
          } else {
            throw redirect ({
              to: "/login", 
              search: {
                destination: "",
                ...location.search
              } 
            })
          }
        })
    }
  }

})

function RootPage(){
  const path = useRouterState().location.pathname
  const isRegisterOrLogin = useMemo(() => path.startsWith("/register") || path.startsWith("/login"), [path]);

  if(isRegisterOrLogin){
    return (
          <>
            <Outlet />
            <TanStackRouterDevtools />
            <Toaster />
          </>
        )
  }

  const breadCrumbs = path.split("/").filter((c) => c != "")
  
  const loggedInUser = _getUser();
  const setUser = useLMSContext((state) => state.setUser)

  setUser(loggedInUser)  
  
  return (
    <>
      <main className='bg-blue-50 w-screen min-h-screen sm:overflow-hidden sm:py-10 sm:p-4'>
          <div className='min-h-screen sm:min-h-0 h-[calc(100vh-5rem)] w-full sm:w-[calc(100vw-5rem)] sm:flex sm:gap-4'>
              <SidebarComponent />
              <div className='w-full min-h-screen sm:min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white shadow-sm rounded p-4 pt-10 sm:p-8'>
                <span className='flex gap-2 mb-2'>
                  <Link to={"/"}  className='flex gap-2 items-center text-blue-900 '>
                    <span>Home</span>
                    <span>{">"}</span>
                  </Link>
                  {breadCrumbs.map((crumb, idx) => {
                    return (
                      <Link to={"/" + breadCrumbs.slice(0, idx+1).join('/')}  className='flex gap-2 items-center text-blue-900'>
                        {crumb[0].toUpperCase() + crumb.substring(1)}
                        {idx != breadCrumbs.length - 1 && <span>{">"}</span> }
                      </Link>
                    )
                  }) }
              </span>
              <div className='w-full min-h-[calc(100vh-5.5rem)] sm:min-h-0 sm:h-[calc(100%-2rem)]'>
                <Outlet />
              </div>
            </div>
          </div>
      </main>
      { import.meta.env.PROD && <TanStackRouterDevtools /> }
      <Toaster />
    </>
  )
}