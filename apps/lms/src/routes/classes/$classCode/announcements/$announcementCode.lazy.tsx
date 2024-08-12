import { Button, DialogContainer } from '@repo/ui';
import { _getToken } from '@repo/utils'
import { createLazyFileRoute, useRouterState, Outlet, Link } from '@tanstack/react-router'
import dayjs from 'dayjs';
import { useAnnouncement } from '../../../../hooks';

export const Route = createLazyFileRoute('/classes/$classCode/announcements/$announcementCode')({
  component: Announcements
})

function Announcements({ }){
  const routerState = useRouterState();
  const { classCode, announcementCode } = Route.useParams()

  if(routerState.location.pathname !== `/classes/${classCode}/announcements/${announcementCode}`){
    return <Outlet />
  } 


  const { isLoading, announcement } = useAnnouncement(true, announcementCode, false)
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

            { !isLoading && announcement &&
                <div className='flex flex-col gap-2 flex-1'>
                    <div className='mt-2'>
                        <h3 className='text-blue-800'>{announcement.title}</h3>
                        <span className='mt-3 flex gap-2 flex-wrap items-center'>
                        <span className='bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                                <span>Author:</span>
                                <span className='font-light'>{announcement.createdBy.firstName + " " + announcement.createdBy.lastName}</span>
                            </span>
                            <span className='bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                                <span>Created:</span>
                                <span className='font-light'>{dayjs(announcement.createdAt).format("HH:mm - DD/MM/YY")}</span>
                            </span>
                            { announcement.createdAt != announcement.updatedAt && 
                                 <span className='bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                                    <span>Updated:</span>
                                    <span className='font-light'>{dayjs(announcement.updatedAt).format("HH:mm - DD/MM/YY")}</span>
                                </span>
                            }
                        </span>
                    </div>
                    <span className='mt-4 text-blue-700 font-light'>Content</span>
                    <div className='mt-4 flex-1 overflow-y-auto' dangerouslySetInnerHTML={{ __html: announcement.content }}>
                    </div>
                </div>
            }

            { !isLoading && !announcement &&

                <div className='mt-2 flex gap-2'>
                    <h3 className='text-blue-800'>404 - Could not find Announcement</h3>
                </div>
            }
         </div>
        </>
    )

}