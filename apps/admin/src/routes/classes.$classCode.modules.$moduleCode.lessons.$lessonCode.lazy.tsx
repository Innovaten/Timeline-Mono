import { createLazyFileRoute, useRouterState, Outlet, Link } from '@tanstack/react-router'
import { Button } from '@repo/ui';
import { _getToken } from '@repo/utils'
import dayjs from 'dayjs';
import { useLesson } from '../hooks';
import { PhotoIcon, DocumentIcon, PaperClipIcon, ShareIcon } from   '@heroicons/react/24/outline'
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
                    <h3 className='text-blue-800'>{lesson.title}</h3>
                    <span className='mt-3 flex gap-2 flex-wrap items-center'>
                        <span className='bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                            <span>Author:</span>
                            <span className='font-light'>{lesson.createdBy?.firstName + " " + lesson.createdBy?.lastName}</span>
                        </span>
                        <span className='bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                            <span>Created:</span>
                            <span className='font-light'>{dayjs(lesson.createdAt).format("HH:mm - DD/MM/YY")}</span>
                        </span>
                        
                        { lesson.createdAt != lesson.updatedAt && 
                            <span className='bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                                <span>Updated:</span>
                                <span className='font-light'>{dayjs(lesson.updatedAt).format("HH:mm - DD/MM/YY")}</span>
                            </span>
                        }
                    </span> 
                    <div className='pt-5'>
                    <span className='mt-4 text-blue-700 font-light'>Content</span>
                    <div className='flex-1 overflow-y-auto text-blue-700' dangerouslySetInnerHTML={{ __html: lesson.content }}>
                    </div>
                    </div>
                    {
                    lesson.resources && 
                    <>
                        <div className='flex-1 mt-14'>
                            <span className='mt-4 text-blue-700 font-light'>Resources</span>
                            <div className='mt-2 grid grid-cols-1 text-blue-700 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-8'>
                                { lesson.resources && lesson.resources.length > 0 && lesson.resources.map((resource, idx) => {
                                        return (
                                            <a className='flex max-w-[200px] gap-2 p-2 rounded-sm bg-blue-300/10 border-[1.5px] border-blue-600/10 ' target='_blank' href={resource.link} key={idx}>
                                                { resource.type == "Image" &&
                                                    <PhotoIcon className='w-4 shrink-0' />
                                                }
                                                { resource.type == "Document" &&
                                                    <DocumentIcon className='w-4 shrink-0' />
                                                }
                                                { resource.type == "Link" &&
                                                    <ShareIcon className='w-4 shrink-0' />
                                                }
                                                { resource.type == "Other" &&
                                                    <PaperClipIcon className='w-4 shrink-0' />
                                                }
                                                <p className='font-light truncate'>{resource.title}</p>
                                            </a>
                                        )
                                    })    
                                }
                                {
                                    (!lesson.resources || lesson.resources.length == 0 ) && 
                                     <>
                                      <div className='flex gap-2 p-2 rounded-sm bg-blue-300/10 border-[1.5px] border-blue-600/10 '>
                                          <PaperClipIcon className='w-4 shrink-0' />                                            
                                          <p className='font-light'>No resources</p>
                                      </div>
                                     </>
                                  } <div className='w-full sm:w-fit shrink-0 flex flex-col sm:flex-row gap-2 justify-end'>
                                  <Link to={`/classes/${classCode}/modules/${moduleCode}/lessons/${lessonCode}/update`} className='w-full'>
                                      <Button
                                          variant='outline'
                                          className='w-full'
                                      >Edit Lesson</Button>
                                  </Link>    
                              </div>
                            </div>    
                        </div>
                    </>
                }
                </div>
               
                <div className='flex flex-col sm:flex-row gap-4 sm:gap-2 sm:justify-between sm:items-end '>
                </div>
          </div>   
        }
    </div> 
          
    )

}