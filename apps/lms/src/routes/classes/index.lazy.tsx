import { createLazyFileRoute, Link, useRouterState, Outlet } from '@tanstack/react-router';
import { _getToken, useToggleManager } from '@repo/utils';
import { useClasses } from '../../hooks';

export const Route = createLazyFileRoute('/classes/')({
    component: Classes
})


function Classes(){
    const routerState = useRouterState();

    if(routerState.location.pathname !== "/classes"){
        return <Outlet />
      } 

    const initialToggles = {
        'refresh': false,
    }

    type TogglesType = typeof initialToggles
    type ToggleKeys = keyof TogglesType
    const toggleManager = useToggleManager<ToggleKeys>(initialToggles);


    const { isLoading: classesIsLoading, classes, count: classesCount } = useClasses(toggleManager.get('refresh'), {});

    return (
        <>

            <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full'>
                <div className='mt-2 flex h-fit justify-between items-center'>
                    <h3 className='text-blue-800'>Classes</h3>
                </div>
                <div className='w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow'>
                    <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
                        <div className = 'w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                                <div className='flex items-center gap-4'>
                                    <span className='flex-1 font-normal truncate'>NAME</span>
                                </div>
                                <div className='flex gap-4 items-center font-light'>
                                  <span className='w-[100px]  hidden sm:flex justify-end'>MODE</span>
                                </div>
                            </div>
                        {
                            classesIsLoading && 
                             <div className='w-full h-full m-auto'>
                                <div
                                    className='w-5 aspect-square m-auto mt-4 rounded-full border-[1px] border-t-blue-500 animate-spin' 
                                ></div>
                            </div>
                        } 
                        { 
                        !classesIsLoading && classes && classes.length != 0 && classes.map((tClass, idx) => {
                            return (
                            // Onclick trigger a dialog
                            <Link 
                              to={`/classes/${tClass.code}`}
                              key={idx} 
                              className = 'w-full text-blue-700 cursor-pointer py-2 px-1 sm:px-3 bg-white border-blue-700/40 border-b-[0.5px] flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'
                            >
                                <div className='flex items-center gap-4 truncate'>
                                    <span className='flex-1 font-normal truncate'>{tClass.name}</span>
                                </div>
                                <div className='flex gap-4 items-center font-light'>
                                  <span className='hidden w-[100px] sm:flex justify-end'>{tClass.modeOfClass}</span>
                                </div>

                            </Link>
                            )
                        })
                        }
                    </div>
                </div>
                <div className='flex justify-end text-blue-700 mt-2 pb-2'>
                    <p>Showing <span className='font-semibold'>{classes?.length ?? 0}</span> of <span className='font-semibold'>{classesCount}</span></p>
                </div>
            </div>
        </>
    )

}
