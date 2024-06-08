import { createLazyFileRoute } from '@tanstack/react-router'
import { _getToken } from '@repo/utils';

import { useLMSContext } from '../main'
import { BookOpenIcon, MegaphoneIcon, PencilSquareIcon, NewspaperIcon } from '@heroicons/react/24/outline'

export const Route = createLazyFileRoute('/')({
  component: IndexPage
})

function IndexPage() {

    const user = useLMSContext((state) => state.user);
    
    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? "Morning" :
        currentHour < 17 ? "Afternoon" : "Evening"

    const stats = [
      {
        label: 'Active Classes',
        value: 3,
        icon: BookOpenIcon,
      },
      {
        label: 'Announcements',
        value: 10,
        icon: MegaphoneIcon,
      },
      {
        label: 'Pending Quizzes',
        value: 4,
        icon: PencilSquareIcon,
      },
      {
        label: 'Pending Assignments',
        value: 11,
        icon: NewspaperIcon,
      },

    ]
    return (
       <>
          <div className='text-blue-900'>
            <h2 className='mt-7'>Good {greeting}, {user?.firstName || "Kwabena"}</h2>
            <div className='mt-8 flex gap-5 w-full justify-evenly'>
              {
                stats.map(({ label, icon, value}, idx) => (
                  <StatCard
                    label={label}
                    icon={icon}
                    value={value}
                  />
                ))
              }
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