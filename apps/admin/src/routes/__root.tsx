import { createRootRouteWithContext, Link, Outlet, useRouterState, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { _clearTokens, _getToken, _getTokenExpiration, _getUser, _setUser } from '@repo/utils';
import SidebarComponent from '../components/Sidebar.component';
import { Toaster } from 'sonner';
import { IUserDoc } from "@repo/models";
import { useLMSContext } from '../app';
import { makeAuthenticatedRequest } from '@repo/utils';
import { MinifiedUser } from '../context';

export interface ConsoleRouterContext {
  user: MinifiedUser | null,
}


export const Route = createRootRouteWithContext<ConsoleRouterContext>()({
  component: RootPage,
  beforeLoad: ( {  location }) => {
    const authToken = _getToken()
    const userToken = _getUser()
    const expirationDate = _getTokenExpiration()

    const userTokensAreNotSet = !authToken || !userToken || ( new Date(expirationDate ?? "").getTime() < new Date().getTime() ) 
    const isNotLoginPage = !location.href.startsWith('/login')

    if(isNotLoginPage && userTokensAreNotSet ){ // If we don't know you
      if(new Date(expirationDate ?? "").getTime() < new Date().getTime()){
        _clearTokens()
      }
      throw redirect ({to: "/login"})

    } else if(authToken && !userToken){ //  You have a token but user context is not set
        makeAuthenticatedRequest(
          "get",
          '/api/v1/auth/verify-token'
        ).then(res => {
          console.log(res.data)
          if(res.data.success){
            _setUser(res.data.data);
          } else {
            throw redirect ({to: "/login"})
          }
        })
    }
  }
})

function RootPage(){
  if (useRouterState().location.pathname.startsWith("/login")){
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
        <Toaster />
      </>
    )
  }

  const breadCrumbs = useRouterState().location.pathname.split("/").filter((c) => c != "")
  
  const loggedInUser = _getUser();
  const setUser = useLMSContext((state) => state.setUser)

  setUser(loggedInUser)  

  return (
    <>
      <main className='bg-blue-50 w-screen min-h-screen sm:overflow-hidden scrollbar scrollbar-thin scrollbar-thumb-blue-700/40 scrollbar-track-slate-500 sm:p-4 sm:py-10'>
          <div className='min-h-screen sm:min-h-0 sm:h-[calc(100vh-5rem)] w-full sm:w-[calc(100vw-2rem)] sm:flex sm:gap-4'>
              <SidebarComponent />
              <div className='w-full min-h-screen sm:min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white shadow-sm rounded p-4 pt-10 sm:p-8'>
                <span className='flex gap-2 mb-2'>
                  <Link to={"/"}  className='flex gap-2 items-center text-blue-900 '>
                    <span>Home</span>
                    <span>{">"}</span>
                  </Link>
                  {breadCrumbs.map((crumb, idx) => {
                    return (
                      <Link key={idx} to={"/" + breadCrumbs.slice(0, idx+1).join('/')}  className='flex gap-2 items-center text-blue-900'>
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
      { import.meta.env.DEV && <TanStackRouterDevtools /> }
      <Toaster />
    </>
  )
}
