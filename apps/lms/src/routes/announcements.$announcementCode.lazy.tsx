import { _getToken } from '@repo/utils'
import { createLazyFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs';
import { useAnnouncement } from '../hooks/announcements.hooks';


export const Route = createLazyFileRoute('/announcements/$announcementCode')({
  component: Announcement
})

function Announcement({ }){;
  const { announcementCode } = Route.useParams()

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
                        <span className='flex gap-2 items-center'>
                           Created at: <small>{dayjs(announcement.createdAt).format("HH:mm - DD/MM/YY")} </small> •
                            { announcement.createdAt != announcement.updatedAt && 
                                <>
                                    <small>Last updated: {dayjs(announcement.updatedAt).format(" HH:mm - DD/MM/YY")}</small> •
                                </>
                            }
                            <small>Author: {announcement.createdBy.firstName + " " + announcement.createdBy.lastName}</small>

                        </span>
                    </div>
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