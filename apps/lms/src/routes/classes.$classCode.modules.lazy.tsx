
import { createLazyFileRoute, useRouterState, Outlet, Link } from '@tanstack/react-router'
import { useModules } from '../hooks';
import dayjs from 'dayjs';
import { useDialog } from '@repo/utils';

export const Route = createLazyFileRoute('/classes/$classCode/modules')({
  component: classModules
})

function classModules({}){

  const routerState = useRouterState();
  const { classCode } = Route.useParams();

  if(routerState.location.pathname !== `/classes/${classCode}/modules`){
    return <Outlet />
  } 

  const { dialogIsOpen: refreshFlag } = useDialog();

  



  const { isLoading: modulesIsLoading, modules, count: modulesCount } = useModules(refreshFlag, 10, 0, classCode)
  
    


  return (
    <>
        <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1'>
          <div className='mt-2 flex h-fit justify-between items-center'>
              <h3 className='text-blue-800'>Class Modules</h3>
            
          </div>
         
          <div className='w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow'>
                    <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
                        <div className = 'w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                            <div className='flex items-center gap-4'>
                                <span className='flex-1 font-normal truncate'>TITLE</span>
                            </div>
                            <div className='flex gap-4 items-center font-light'>
                                <span className='w-[150px] hidden sm:flex justify-end'>AUTHOR</span>
                                <span className='w-[150px] hidden sm:flex justify-end'>DATE CREATED</span>
                                
                            </div>
                        </div>
                        {
                            modulesIsLoading && 
                            <div className='w-full h-full m-auto mt-4'>

                                <div
                                    className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                                ></div>
                            </div>
                        } 
                        { 
                            !modulesIsLoading && modules.map((module, idx) => {
                                return (
                                <Link to={`/classes/${classCode}/modules/${module.code}`} key={idx} className = 'cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'>
                                    <div className='flex items-center gap-4'>
                                        <span className='flex-1 font-normal truncate'>{module.title}</span>
                                    </div>
                                    <div className='flex gap-4 items-center font-light'>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{module.createdBy.firstName + " " + module.createdBy.lastName}</span>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{dayjs(module.createdAt).format("HH:mm - DD/MM/YY")}</span>
                                        
                                    </div>
                                </Link>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='flex justify-end text-blue-700 mt-2 pb-2'>
                    <p>Showing <span className='font-semibold'>{modules.length}</span> of <span className='font-semibold'>{modulesCount}</span></p>
                </div>
            </div>
        </>
    )

}
