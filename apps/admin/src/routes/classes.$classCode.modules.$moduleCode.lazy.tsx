import { createLazyFileRoute, useRouterState, Outlet, Link } from '@tanstack/react-router'
import { Button } from '@repo/ui';
import { _getToken } from '@repo/utils'
import dayjs from 'dayjs';
import { useModule } from '../hooks';

export const Route = createLazyFileRoute('/classes/$classCode/modules/$moduleCode')({
  component: Module
})

function Module(){


  const routerState = useRouterState();
  const { classCode, moduleCode } = Route.useParams()

  if(routerState.location.pathname !== `/classes/${classCode}/modules/${moduleCode}`){
    return <Outlet />
  } 


  const { isLoading, module } = useModule(true, moduleCode, false)
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

            { !isLoading && module &&
                <div className='flex flex-col gap-2 flex-1'>
                    <div className='mt-2'>
                      <div className='mt-2 flex h-fit justify-between items-center'>
                        <h3 className='text-blue-800'>{module.title}</h3>
                        <div className='mt-2 flex h-fit justify-between items-center'>
                          <Link to={`/classes/${classCode}/modules/${moduleCode}/lessons`}>
                            <Button className='flex px-2 !h-[32px] w-34' onClick={(e) => { e.stopPropagation();}}> Lessons</Button>
                          </Link>
                           </div>
                          </div>
                        <span className='flex gap-2 items-center'>
                            <small>{dayjs(module.createdAt).format("HH:mm - DD/MM/YY")} </small> •
                            { module.createdAt != module.updatedAt && 
                                <>
                                    <small>Last updated: {dayjs(module.updatedAt).format(" HH:mm - DD/MM/YY")}</small> •
                                </>
                            }
                            <small>Author: {module.createdBy.firstName + " " + module.createdBy.lastName}</small>
                            
                        </span>
                    </div>
                </div>
            }

            { !isLoading && !module &&

                <div className='mt-2 flex gap-2'>
                    <h3 className='text-blue-800'>404 - Could not find Module</h3>
                </div>
            }
         </div>
        </>
    )

}