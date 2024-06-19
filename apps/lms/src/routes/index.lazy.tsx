import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { _getToken } from '@repo/utils';

import { useLMSContext } from '../main'
import { BookOpenIcon, MegaphoneIcon, PencilSquareIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData'
import CalendarComponent from '../components/Calendar.component';

dayjs.extend(localeData)

export const Route = createLazyFileRoute('/')({
  component: IndexPage
})

function IndexPage() {

    const user = useLMSContext((state) => state.user);
    
    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? "Morning" :
        currentHour < 17 ? "Afternoon" : "Evening"

    const events = [
      {
        title: 'Assignment Update',
        date: '4 Jun', // Of course we won't be using this in the final implementation
        url: 'LMS/classes/SAT0001/assignments/ghg3-ja3r-lkn43-4934'
      },
      {
        title: 'SAT Trial Quiz',
        date: '2 Jun',
        url: 'LMS/classes/SAT0001/quizzes/ghg3-ja3r-lkn43-4934'
      },
      {
        title: 'New Assignment',
        date: '4 Jun',
        url: 'LMS/classes/SAT0001/assignments/ghg3-ja3r-lkn43-4934'
      },
    ]

    const resources = [
      {
        title: 'Lecture Notes',
        class: 'SAT SEPT 2024',
        date: '18:45 - 3 Jun',
        url: 'LMS/classes/SAT0001/resources/9340-akjh-82hg-894u'
      },
      {
        title: 'Recommended Text',
        class: 'SAT SEPT 2024',
        date: '12:06 - 1 Jun',
        url: 'LMS/classes/SAT0001/resources/9340-akjh-82hg-894u'
      },
      {
        title: 'Quiz Questions & Answers',
        class: 'SAT AUG 2024',
        date: '07:23 - 21 May',
        url: 'LMS/classes/SAT0002/resources/9340-akjh-82hg-894u'
      },
    ]

    const stats = [
      {
        label: 'Classes',
        value: 3,
        icon: BookOpenIcon,
      },
      {
        label: 'Announcements',
        value: 10,
        icon: MegaphoneIcon,
      },
      {
        label: 'Quizzes',
        value: 4,
        icon: PencilSquareIcon,
      },
      {
        label: 'Assignments',
        value: 11,
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
          <div className='text-blue-900'>
            <h3 className='mt-2'>Good {greeting}, {user?.firstName || "Kwabena"}</h3>
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
            <div className='mt-4 flex flex-col sm:flex-row gap-4 w-full justify-evenly '>
              <div className='w-full'>
                <h4>Calendar</h4>
                <CalendarComponent events={testEvents} />
              </div>
              <div className='w-full'>
                <h4>Events</h4>
                <div className='w-full aspect-[18/9] bg-blue-50 p-1 rounded-sm shadow-sm mt-2'>
                  <div className='bg-white w-full h-full flex flex-col gap-2 rounded p-1'>
                    {
                      events.map(({title, date, url}, idx) => {
                        return (
                          <Link key={idx} to={url.replace("LMS", "http://localhost:3001")} className = 'w-full py-2 px-3 bg-blue-50 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-600/10'>
                            <h5 className='flex-1 font-normal truncate'>{title}</h5>
                            <span className='font-light'>{date}</span>
                          </Link>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-4 w-full flex flex-col gap-2'>
              <h4>Latest Resources</h4>
              <div className='w-full min-h-[100px] bg-blue-50 p-1 rounded-sm shadow-sm mt-2'>
                  <div className='bg-white w-full h-full flex flex-col gap-2 rounded p-1'>
                    {
                      resources.map(({title, date, class: timelineClass, url }, idx) => {
                        return (
                          <Link key={idx} to={url.replace("LMS", "http://localhost:3001")} className = 'w-full py-2 px-3 bg-blue-50 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-600/10'>
                            <h5 className='flex-1 font-normal truncate'>{title}</h5>
                            <div className='flex gap-4 items-center font-light'>
                              <span>{timelineClass}</span>
                              <span>{date}</span>
                            </div>
                          </Link>
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