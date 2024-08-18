import { Button } from '@repo/ui';
import { _getToken, useToggleManager } from '@repo/utils'
import { createLazyFileRoute, useRouterState, Outlet, Link } from '@tanstack/react-router'
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useAnnouncementsByClass } from '../../../../hooks';
import dayjs from 'dayjs';


export const Route = createLazyFileRoute('/classes/$classCode/announcements/')({
  component: Announcements
})

function Announcements({ }){
  const routerState = useRouterState();
  const { classCode } = Route.useParams()
  
  if(routerState.location.pathname !== `/classes/${classCode}/announcements`){
      return <Outlet />
  } 
  
  const initialToggles = {
    'refresh': false,
    }

  type TogglesType = typeof initialToggles
  type ToggleKeys = keyof TogglesType
  const toggleManager = useToggleManager<ToggleKeys>(initialToggles);

  const { isLoading: announcementsIsLoading, announcements} = useAnnouncementsByClass(toggleManager.get('refresh'), classCode, false)
    
  return (
    <>
        <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1'>
          <div className='mt-2 flex h-fit justify-between items-center'>
              <h3 className='text-blue-800'>Class Announcements</h3>
          </div>
          <div className='w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow'>
                <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
                    <div className = 'w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                        <div className='flex items-center gap-4'>
                            <span className='flex-1 font-normal truncate'>TITLE</span>
                        </div>
                        <div className='flex gap-4 items-center font-light'>
                            <span className='w-[150px] hidden sm:flex justify-end'>AUTHOR</span>
                            <span className='w-[120px] hidden sm:flex justify-end'>DATE CREATED</span>
                        </div>
                    </div>
                    {
                        announcementsIsLoading && 
                        <div className='w-full h-full m-auto mt-4'>

                            <div
                                className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                            ></div>
                        </div>
                    } 
                    { 
                        !announcementsIsLoading && announcements && announcements.map((announcement, idx) => {
                            return (
                            <Link to={`/classes/${classCode}/announcements/${announcement.code}`} key={idx} className = 'cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'>
                                <div className='flex-1 flex items-center gap-4 truncate'>
                                    <span className='flex-1 font-normal truncate'>{announcement.title}</span>
                                </div>
                                <div className='flex gap-4 items-center font-light'>
                                
                                    <span className='w-[150px] hidden sm:flex justify-end'>{announcement.createdBy.firstName + " " + announcement.createdBy.lastName}</span>
                                    <span className='w-[120px] hidden sm:flex justify-end'>{dayjs(announcement.createdAt).format("HH:mm - DD/MM/YY")}</span>
                                </div>
                            </Link>
                            )
                        })
                    }
                </div>
          </div>
          <div className='w-full pt-4'></div>

        </div>
        
    </>
    )

}