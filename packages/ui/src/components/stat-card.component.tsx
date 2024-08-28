import { BookOpenIcon } from '@heroicons/react/24/outline'

type StatCardType = {
    label: string,
    value: string | number,
    icon: typeof BookOpenIcon
    className?: string,
  }
  

export function StatCard({label, value, icon, className }: StatCardType){

    const Icon = icon
  
    return (
      <>
        <div className={` ${className} flex gap-2 sm:gap-3 bg-blue-50 p-2 sm:p-4 w-[calc(50%-10px)] sm:w-full rounded items-center shadow-sm`}>
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