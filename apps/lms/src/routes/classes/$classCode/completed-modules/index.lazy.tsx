
import { createLazyFileRoute, useRouterState, Outlet } from '@tanstack/react-router'
import { _getToken } from '@repo/utils'
import dayjs from 'dayjs';
import { useCompletedModules } from '../../../../hooks';
import { useLMSContext } from '../../../../app';

export const Route = createLazyFileRoute('/classes/$classCode/completed-modules/')({
  component: CompletedModules
})


function CompletedModules(){


  const routerState = useRouterState();
  const { classCode } = Route.useParams()
  const {user} = useLMSContext()

  if(routerState.location.pathname !== `/classes/${classCode}/completed-modules`){
    return <Outlet />
  } 


  const { isLoading, completedModules } = useCompletedModules(true, user?._id?? "")
  
  return (
    <>
        <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1'>
            { isLoading &&
                <div className='w-full h-full m-auto mt-4'>
                    <div
                        className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                    ></div>
                </div>
            }

            { !isLoading && completedModules.length !== 0 &&
            <>
    
                <div className='flex flex-col gap-2 flex-1'>
                    <div className='mt-2'>
                        <h3 className='text-blue-800'>Completed Modules</h3>
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
                            completedModules.map((module, idx) => {
                                return (
                                <div className = 'cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'>
                                    <div className='flex items-center gap-4'>
                                        <span className='flex-1 font-normal truncate'>{module.title}</span>
                                    </div>
                                    <div className='flex gap-4 items-center font-light'>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{module.createdBy.firstName + " " + module.createdBy.lastName}</span>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{dayjs(module.createdAt).format("HH:mm - DD/MM/YY")}</span>
                                        
                                    </div>
                                </div>
                                )
                            })
                        }
                        </div>
                        </div>
                        
                    </div>
                    <div className='flex flex-col sm:flex-row gap-4 sm:gap-2 sm:justify-between sm:items-end '>
                    </div>
                    </div>
</>
                
            }

            {
                completedModules.length == 0 &&
                <div className='mt-2 flex gap-2'>
                    <h3 className='text-blue-800'>No Completed Modules</h3>
                </div>
            }

            { !isLoading && !completedModules &&

                <div className='mt-2 flex gap-2'>
                    <h3 className='text-blue-800'>404 - Could not find Completed Modules</h3>
                </div>
            }
         </div>
        </>
    )

}