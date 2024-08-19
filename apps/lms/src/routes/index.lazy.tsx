import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { _getToken } from '@repo/utils';

import { useLMSContext } from '../app'
import { BookOpenIcon, MegaphoneIcon, PencilSquareIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData'
import CalendarComponent from '../components/Calendar.component';
import { useAnnouncementsResource, useAssignmentsResource, useClassesResource } from '../hooks';

dayjs.extend(localeData)

export const Route = createLazyFileRoute('/')({
  component: IndexPage
})

function IndexPage() {

    const user = useLMSContext((state) => state.user);
    const { classesNum } = useClassesResource()
    const { announcementsNum } = useAnnouncementsResource()
    const { assignmentsNum } = useAssignmentsResource()


    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? "Morning" :
        currentHour < 17 ? "Afternoon" : "Evening"

    const resources = [];

    const stats = [
      {
        label: 'Classes',
        value: classesNum,
        icon: BookOpenIcon,
      },
      {
        label: 'Announcements',
        value: announcementsNum,
        icon: MegaphoneIcon,
      },
      {
        label: 'Quizzes',
        value: 0,
        icon: PencilSquareIcon,
      },
      {
        label: 'Assignments',
        value: assignmentsNum,
        icon: NewspaperIcon,
      },
    ]
    const testEvents = {
      "2024-06-19T11:05:23.033Z": {
        title: "Hi",
        class: "string",
        description: "string",
        url: "string",
      },
      "2024-06-13T11:05:23.033Z": {
        title: "Hi",
        class: "string",
        description: "string",
        url: "string",
      },
      "2024-06-10T11:05:23.033Z": {
        title: "Hi",
        class: "string",
        description: "string",
        url: "string",
      }
    }

    return (
       <>
          <div className='text-blue-900 w-full flex flex-col'>
            <h3 className='mt-4'>Good {greeting}, {user?.firstName || "Kwabena"}</h3>
            <div className='mt-4 flex gap-2 sm:gap-5 flex-wrap sm:flex-nowrap w-full justify-evenly'>
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
            <div className='mt-4 flex flex-col sm:flex-row gap-4 w-full justify-evenly '>
              <div className='w-full'>
                <h4>Calendar</h4>
                <CalendarComponent events={testEvents} />
              </div>
              <div className='w-full'>
                <h4>Events</h4>
                <div className='w-full h-[calc(100%-2.25rem)] bg-blue-50 p-1 rounded-sm shadow-sm mt-2'>
                  <div className='bg-white w-full h-full flex flex-col gap-2 rounded p-1'>
                    {
                      [].map((event: any, idx) => {
                        return (
                          <Link key={idx} className = 'w-full py-2 px-3 bg-blue-50 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-600/10'>
                            <h5 className='flex-1 font-normal truncate'>{event.title}</h5>
                            <span className='font-light'>{event.date}</span>
                          </Link>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
            {/* <div className='mt-4 w-full flex flex-col gap-2'>
              <h4>Latest Resources</h4>
              <div className='w-full min-h-[100px] bg-blue-50 p-1 rounded-sm shadow-sm mt-2'>
                  <div className='bg-white w-full h-full flex flex-col gap-2 rounded p-1'>
                    {
                      [].map((resource: any, idx) => {
                        return (
                          <Link key={idx}  className = 'w-full py-2 px-3 bg-blue-50 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-600/10'>
                            <h5 className='flex-1 font-normal truncate'>{resource.title}</h5>
                            <div className='flex gap-4 items-center font-light'>
                              <span>{resource.timelineClass}</span>
                              <span>{resource.date}</span>
                            </div>
                          </Link>
                        )
                      })
                    }
                  </div>
                </div>
            </div> */}
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
      <div className='flex gap-2 sm:gap-3 bg-blue-50 p-2 sm:p-4 w-[calc(50%-10px)] sm:w-full rounded items-center shadow-sm'>
        <div className='w-[40px] sm:w-16 aspect-square bg-white rounded-full grid place-items-center'>
          <Icon className='w-4 sm:w-8 text-blue-600'/>
        </div>
        <div className='flex-1 flex flex-col justify-center'>
          <div className='flex flex-col'>
            <p className='font-semibold text-2xl sm:text-3xl truncate'>{value}</p>
            <p>{label}</p>
          </div>
        </div>
      </div>
    </>
  )

}