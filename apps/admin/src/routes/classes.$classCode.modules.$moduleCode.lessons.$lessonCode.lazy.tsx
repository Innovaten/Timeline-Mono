import { createLazyFileRoute, useRouterState, Outlet, Link } from '@tanstack/react-router'
import { Button } from '@repo/ui';
import { _getToken } from '@repo/utils'
import dayjs from 'dayjs';
import { useLesson } from '../hooks';
export const Route = createLazyFileRoute('/classes/$classCode/modules/$moduleCode/lessons/$lessonCode')({
  component: Lesson
})

function Lesson(){


  const routerState = useRouterState();
  const { classCode, moduleCode, lessonCode } = Route.useParams()

  if(routerState.location.pathname !== `/classes/${classCode}/modules/${moduleCode}/lessons/${lessonCode}`){
    return <Outlet />
  } 


  const { isLoading, lesson } = useLesson(true, lessonCode, false)
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

            { !isLoading && lesson &&
                <div className='flex flex-col gap-2 flex-1'>
                    <div className='mt-2'>
                      <div className='mt-2 flex h-fit justify-between items-center'>
                        <h3 className='text-blue-800'>{lesson.title}</h3>
                        <div className='mt-2 flex h-fit justify-between items-center'>
                          <Link to={`/classes/${classCode}/modules/${moduleCode}/lessons`}>
                            <Button className='flex px-2 !h-[32px] w-34' onClick={(e) => { e.stopPropagation();}}> Lessons</Button>
                          </Link>
                           </div>
                          </div>
                        <span className='flex gap-2 items-center'>
                            <small>{dayjs(lesson.createdAt).format("HH:mm - DD/MM/YY")} </small> •
                            { lesson.createdAt != lesson.updatedAt && 
                                <>
                                    <small>Last updated: {dayjs(lesson.updatedAt).format(" HH:mm - DD/MM/YY")}</small> •
                                </>
                            }
                            <small>Author: {lesson.createdBy.firstName + " " + lesson.createdBy.lastName}</small>
                          
                        </span>
                        <div className='mt-4 flex-1 overflow-y-auto' dangerouslySetInnerHTML={{ __html: lesson.content }}>
                        </div>
                    </div>
                </div>
            }

            { !isLoading && !lesson &&

                <div className='mt-2 flex gap-2'>
                    <h3 className='text-blue-800'>404 - Could not find Lesson</h3>
                </div>
            }
         </div>
        </>
    )

}