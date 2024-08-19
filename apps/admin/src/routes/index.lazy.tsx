import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { _getToken, cn } from '@repo/utils';

import { useLMSContext } from '../app'
import { BookOpenIcon, UsersIcon, AcademicCapIcon, PencilSquareIcon, MegaphoneIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData'
import { useRegistrations, useAdminsCount, useClassesCount, usePendingCount, useStudentsCount, useAnnouncementsCount } from '../hooks';
import { Button, StatCard } from '@repo/ui';

dayjs.extend(localeData)

export const Route = createLazyFileRoute('/')({
  component: IndexPage
  // Maybe split into two separate pages for admin and sudo
})

function IndexPage() {

  
    const user = useLMSContext((state) => state.user);
    
    const { registrations, isLoading: registrationsIsLoading } = useRegistrations()
    const { pendingCount } = usePendingCount()
    const { adminCount } = useAdminsCount()
    const { studentCount } = useStudentsCount()
    const { classesCount } = useClassesCount()
    const { announcementsCount } = useAnnouncementsCount()
    
 
    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? "Morning" :
        currentHour < 17 ? "Afternoon" : "Evening"


    const stats = ( user?.role ?? "ADMIN" ) == "ADMIN" ?
    [
      {
        label: 'My Classes',
        value: classesCount,
        icon: BookOpenIcon,
      },
      {
        label: 'Announcements',
        value: announcementsCount,
        icon: MegaphoneIcon,
      },
      {
        label: 'Quizzes',
        value: 4,
        icon: PencilSquareIcon,
      },
      {
        label: 'Assignments',
        value: 67,
        icon: NewspaperIcon,
      },
    ]
    : // SUDO 
    [
      {
        label: 'Total Classes',
        value: classesCount,
        icon: BookOpenIcon,
      },
      {
        label: 'Total Students',
        value: studentCount,
        icon: AcademicCapIcon,
      },
      {
        label: 'Total Admins',
        value: adminCount,
        icon: UsersIcon,
      },
      {
        label: 'Registrations',
        value: pendingCount,
        icon: NewspaperIcon,
      },
    ] 

    return (
       <>
          <div className='text-blue-900 w-full h-full flex flex-col'>
            <h3 className='mt-4'>Good {greeting}, {user?.firstName || "Kwabena"}</h3>
            <div className='mt-4 flex gap-2 sm:gap-5 w-full flex-wrap sm:flex-nowrap justify-evenly'>
              {
                stats.map(({ label, icon, value}, idx) => (
                  <StatCard
                    key={idx}
                    label={label}
                    icon={icon}
                    value={value}
                  />
                ))
              }
            </div>
            <div className='mt-8 w-full flex-1 flex flex-col gap-2'>
              <div className='flex justify-between gap-2 items-center'>
                <h4>Latest Registrations</h4>
                <Link to='/registrations' ><Button className='!h-[25px] px-2' variant='outline'>See All</Button></Link>
              </div>
              <div className='w-full flex-1 bg-blue-50 p-1 rounded-sm shadow-sm mt-2 mb-4'>
                  <div className='bg-white  w-full h-full flex flex-col gap-2 rounded'>
                    <div className = 'w-full hidden text-blue-700 py-2 px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 sm:flex justify-between items-center gap-2 rounded-sm'>
                      <div className='flex items-center gap-4'>
                          <span  className='w-[70px] sm:w-[80px]'>CODE</span>
                          <span className='flex-1 font-normal truncate'>NAME</span>
                      </div>
                      <div className='flex gap-4 items-center font-light'>
                          <span className='w-[100px] flex justify-end'>STATUS</span>
                          <span className='w-[150px] sm:flex justify-end'>DATE CREATED</span>
                      </div>
                  </div>
                    {
                       registrationsIsLoading && 
                       <div className='w-full h-full m-auto mt-4'>

                          <div
                            className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                          ></div>
                       </div>
                    } 
                    { 
                       !registrationsIsLoading && registrations.map((registrant, idx) => {
                        
                        return (
                          <div
                            key={idx}
                            className="w-full text-blue-700 py-2 px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10"
                          >
                            <small className='font-light w-[70px] sm:w-[80px]'>{registrant.code}</small>
                            <span className="flex-1 font-normal truncate">
                              {registrant.firstName + " " + registrant.lastName}
                            </span>
                            <div className="flex gap-4 items-center font-light">
                              <span className='w-[100px] flex gap-2 items-center justify-end'>
                                {registrant.status}
                                <span className={cn(
                                  "w-2 h-2 rounded-full border-[1px] ",
                                  registrant.status == 'Pending' ? "border-yellow-600" : "",
                                  registrant.status == 'Approved' ? "border-green-600" : "",
                                  registrant.status == 'Rejected' ? "border-red-600" : "",
                                  registrant.status == 'Accepted' ? "bg-green-600 border-green-600" : "",
                                  registrant.status == 'Denied' ? "bg-red-600 border-red-600" : "",
                                )}></span>
                              </span>
                              <span className='w-[150px] hidden sm:flex justify-end'>
                                {dayjs(registrant.updatedAt).format("HH:mm - DD/MM/YYYY")}
                              </span>
                            </div>
                          </div>
                        )
                      })

                    }
                  </div>
                </div>
            </div>
          </div> 
       </>
    )
}
