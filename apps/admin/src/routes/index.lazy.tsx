import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { _getToken } from '@repo/utils';

import { useLMSContext } from '../app'
import { BookOpenIcon, UsersIcon, AcademicCapIcon, PencilSquareIcon, MegaphoneIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData'
import { useRegistrations } from '../hooks';
import { Button } from '@repo/ui';

dayjs.extend(localeData)

export const Route = createLazyFileRoute('/')({
  component: IndexPage
  // Maybe split into two separate pages for admin and sudo
})

function IndexPage() {

  
    const user = useLMSContext((state) => state.user);
    
    const { registrations, isLoading: registrationsIsLoading } = useRegistrations()
 
    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? "Morning" :
        currentHour < 17 ? "Afternoon" : "Evening"


    const stats = ( user?.role ?? "ADMIN" ) == "ADMIN" ?
    [
      {
        label: 'My Classes',
        value: 12,
        icon: BookOpenIcon,
      },
      {
        label: 'Announcements',
        value: 704,
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
        value: 12,
        icon: BookOpenIcon,
      },
      {
        label: 'Total Students',
        value: 704,
        icon: AcademicCapIcon,
      },
      {
        label: 'Total Admins',
        value: 4,
        icon: UsersIcon,
      },
      {
        label: 'Registrations',
        value: registrations.length,
        icon: NewspaperIcon,
      },
    ] 

    return (
       <>
          <div className='text-blue-900 w-full h-full flex flex-col'>
            <h3 className='mt-4'>Good {greeting}, {user?.firstName || "Kwabena"}</h3>
            <div className='mt-4 flex gap-5 w-full justify-evenly'>
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
              <div className='w-full flex-1 bg-blue-50 p-1 rounded-sm shadow-sm mt-2'>
                  <div className='bg-white w-full h-full flex flex-col gap-2 rounded'>
                    <div className = 'w-full text-blue-700 py-2 px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                      <div className='flex items-center gap-4'>
                          <span  className='w-[80px]'>CODE</span>
                          <span className='flex-1 font-normal truncate'>NAME</span>
                      </div>
                      <div className='flex gap-4 items-center font-light'>
                          <span className='w-[100px] flex justify-end'>STATUS</span>
                          <span className='w-[120px] flex justify-end'>TIME CREATED</span>
                          <span className='w-[150px] flex justify-end'>DATE CREATED</span>
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
                            <small className='font-light w-[80px]'>{registrant.code}</small>
                            <h5 className="flex-1 font-normal truncate">
                              {registrant.firstName + " " + registrant.lastName}
                            </h5>
                            <div className="flex gap-4 items-center font-light">
                              <span className='w-[100px] flex justify-end'>
                                {registrant.status}
                              </span>
                              <span className='w-[120px] flex justify-end'>
                                {new Date(registrant.updatedAt).toLocaleTimeString()}
                              </span>
                              <span className='w-[150px] flex justify-end'>
                                {new Date(registrant.updatedAt).toDateString()}
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

type StatCardType = {
  label: string,
  value: string | number,
  icon: typeof BookOpenIcon
}

function StatCard({label, value, icon}: StatCardType){

  const Icon = icon

  return (
    <>
      <div className='flex gap-3 bg-blue-50 p-4 w-full rounded shadow-sm'>
        <div className='w-16 aspect-square bg-white rounded-full grid place-items-center'>
          <Icon className='w-8 text-blue-600'/>
        </div>
        <div className='flex-1 flex flex-col justify-center'>
          <div className='flex flex-col'>
            <p className='font-semibold text-3xl'>{value}</p>
            <p>{label}</p>
          </div>
        </div>
      </div>
    </>
  )

}