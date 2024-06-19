import { createRootRoute, Link, Navigate, Outlet, useRouter, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { _getToken } from '@repo/utils';
import SidebarComponent from '../components/Sidebar.component';
import { Toaster } from 'sonner';
import { useLMSContext } from '../main';

export const Route = createRootRoute({
  component: RootPage
})

function RootPage(){
  const authToken = _getToken()
  const path = useRouterState().location.pathname

  if( !path.startsWith("/login") && (!authToken) ){ // If we don't know you
    Navigate({to: "/login"})
  } else {
    const isRegisterOrLogin = path.startsWith("/login");
    const breadCrumbs = path.split("/").filter((c) => c != "")
    
    // TODO: Use token to get user.

    return (
      <>
      { !isRegisterOrLogin && 
        <>
          <main className='bg-blue-50 w-screen min-h-screen sm:overflow-hidden p-10'>
              <div className='h-[calc(100vh-5rem)] w-[calc(100vw-5rem)] flex gap-8'>
                  <SidebarComponent />
                  <div className='flex-1 overflow-y-auto overflow-x-hidden bg-white shadow-sm rounded p-4 sm:p-8'>
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
                  <Outlet />
                </div>
              </div>
          </main>
        </>
      }
      { isRegisterOrLogin && <Outlet />}
        <TanStackRouterDevtools />
        <Toaster />
      </>
    )
  }

}