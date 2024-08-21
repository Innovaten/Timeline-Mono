import { createLazyFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import {  CheckIcon } from '@heroicons/react/24/outline';
import { useAnnouncements } from '../hooks/announcements.hooks';
import dayjs from 'dayjs';



export const Route = createLazyFileRoute('/announcements')({
  component: () => <Announcements />
})

function Announcements({}){
  const routerState = useRouterState();
  const { announcements, isLoading, count } = useAnnouncements()
  if(routerState.location.pathname !== '/announcements'){
    return <Outlet />
  }

  return (
    <>
      <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1'>
          <div className='mt-2 flex h-fit justify-between items-center'>
              <h3 className='text-blue-800'>Announcements</h3>
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
                                <span className='w-[100px] flex justify-end'>ACTIONS</span>
                            </div>
                        </div>
                        {
                            isLoading && 
                            <div className='w-full h-full m-auto mt-4'>

                                <div
                                    className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                                ></div>
                            </div>
                        } 
                        { 
                            !isLoading && announcements.map((announcement, idx) => {
                                return (
                                <Link to={`/announcements/${announcement.code}`} key={idx}>
                                  <div key={idx} className = 'cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'>
                                    <div className='flex items-center gap-4'>
                                        <span className='flex-1 font-normal truncate'>{announcement.title}</span>
                                    </div>
                                    <div className='flex gap-4 items-center font-light'>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{announcement.createdBy.firstName + " " + announcement.createdBy.lastName}</span>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{dayjs(announcement.createdAt).format("HH:mm - DD/MM/YY")}</span>
                                        <span className='w-[100px] flex justify-end'>

                                            <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150'>
                                                <CheckIcon className='w-4 h-4' />
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                </Link>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='flex justify-end text-blue-700 mt-2 pb-2'>
                    <p>Showing <span className='font-semibold'>{announcements.length}</span> of <span className='font-semibold'>{count}</span></p>
                </div>
            </div>
    </>
  )

}