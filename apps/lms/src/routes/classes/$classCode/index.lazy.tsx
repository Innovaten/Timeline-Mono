import { createLazyFileRoute, Link ,useRouterState, Outlet } from '@tanstack/react-router'
import { classModuleCount, useClass } from '../../../hooks';
import _ from 'lodash'
import { AcademicCapIcon, PencilSquareIcon, MegaphoneIcon, NewspaperIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { StatCard } from '@repo/ui';
import { useAnnouncementsCount } from '../../../hooks/announcements.hooks';

export const Route = createLazyFileRoute('/classes/$classCode/')({
  component: () => <ClassDetails />
})

function ClassDetails(){

  
  const routerState = useRouterState();
  const { classCode } = Route.useParams();

  if(routerState.location.pathname !== `/classes/${classCode}`){
      return <Outlet />
    } 

  const { thisClass, isLoading: classIsLoading } = useClass(true, classCode, false)
  const {count: modulesCount} = classModuleCount(classCode)
  const {count: announcementsCount} = useAnnouncementsCount(classCode)

  const stats = [
    // {
    //   label: 'Quizzes',
    //   value: thisClass?.quizzes.length ?? 0,
    //   icon: PencilSquareIcon,
    // },
    {
      label: 'Modules',
      value: modulesCount,
      icon: AcademicCapIcon,
    },
    {
      label: 'Announcements',
      value: announcementsCount,
      icon: MegaphoneIcon,
    },
    {
      label: 'Assignments',
      value: thisClass?.assignmentSet?.assignments?.length ?? 0,
      icon: NewspaperIcon,
    },
    // {
    //   label: 'Completed Modules',
    //   value: 0,
    //   icon: AcademicCapIcon
    // },
    // {
    //   label: 'Completed Lessons',
    //   value: 0,
    //   icon: BookOpenIcon
    // }
  ]

  return (
    <>
      {
        classIsLoading && 
        <div className='w-full h-full m-auto mt-4'>
            <div
              className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
            />
        </div>
      }
      { !classIsLoading && thisClass != null &&
        <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1'>
          <div className='mt-2 flex gap-2 flex-col h-fit'>
              <h3 className='text-blue-800'>{thisClass.name}</h3>
              <span className='bg-blue-300/10 w-fit border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                  <span className='text-xs'>Mode:</span>
                  <span className='font-light text-xs'>{_.startCase(thisClass.modeOfClass)}</span>
              </span>
          </div>
          <div className='mt-4'>
            <div className='flex w-full gap-8 text-blue-700'>
              <div className='flex-1 flex flex-col gap-1'>
                <small className='font-light'>Administrators</small>
                <div className='w-full flex gap-4 overflow-y-auto '>
                {
                  thisClass.administrators.length != 0 && thisClass.administrators.map((admin, idx) => {
                    return (
                    <div className={`flex gap-2 items-center rounded p-2 bg-blue-100/40 border-blue-100 duration-150 border-2 `} key={idx}>
                        <div className='rounded-full flex-shrink-0 aspect-square h-full bg-blue-100 text-blue-700 font-light grid place-items-center'>{admin.firstName[0]+ admin.lastName[0]}</div>
                        <div className='flex flex-col truncate'>
                            <p>{admin.firstName} {admin.lastName}</p>
                            <small className='font-light'>{admin.email}</small>
                        </div>
                    </div>
                    )
                  })
                }
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <div className='mt-4 flex text-blue-700 gap-2 sm:gap-5 w-full flex-wrap sm:flex-nowrap justify-evenly'>
              {
                stats.map(({ label, icon, value}, idx) => (
                  <Link to={`/classes/${classCode}/${(label.replaceAll(" ","").toLowerCase())}`} className='w-full border-[1.5px] cursor-pointer border-transparent hover:border-blue-700/40 bg-blue-300/10'>
                    <StatCard
                      key={idx}
                      label={label}
                      icon={icon}
                      value={value}
                    />
                  </Link>
                ))
              }
            </div>

          </div>
        </div>
      }
    </>
  )

}