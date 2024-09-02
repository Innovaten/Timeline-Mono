import { createLazyFileRoute,useRouterState, Outlet, Link } from '@tanstack/react-router'
import { Button, DialogContainer } from '@repo/ui';
import { _getToken, abstractAuthenticatedRequest, useDialog, useFileUploader, useLoading } from '@repo/utils'
import { PlusIcon, ArrowPathIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCompositeFilterFlag, useLessons, useSpecificEntity } from '../../../../../hooks';
import dayjs from 'dayjs';
import { ILessonDoc } from '@repo/models';
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/classes/$classCode/modules/$moduleCode/lessons')({
  component: Lessons
})

function Lessons({ }){
  const routerState = useRouterState();
  const { classCode, moduleCode } = Route.useParams()
  const filesHook = useFileUploader();

  if(routerState.location.pathname !== `/classes/${classCode}/modules/${moduleCode}/lessons`){
    return <Outlet />
  }

  const { toggleDialog: toggleDeleteDialog, dialogIsOpen: deleteDialogIsOpen } = useDialog();
  const { dialogIsOpen: refreshFlag, toggleDialog: toggleRefreshFlag } = useDialog();
  const { isLoading: deleteIsLoading, resetLoading: resetDeleteIsLoading, toggleLoading: toggleDeleteIsloading } = useLoading()
  
  const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ refreshFlag ])

  const { isLoading: lessonsIsLoading, lessons, count: lessonsCount } = useLessons(compositeFilterFlag, 50, 0, {
      moduleCode,
    })
    
  const { entity: selectedLesson, setSelected: setSelectedLesson, resetSelected} = useSpecificEntity<ILessonDoc>();


  function handleDeleteLesson(){
    if(!selectedLesson) return 

    abstractAuthenticatedRequest(
      "delete",
      `/api/v1/lessons/${selectedLesson._id}?classCode=${classCode}`,
      {},
      {},
      {
        onStart: toggleDeleteIsloading,
        onSuccess: (data) => {
          resetSelected()
          toggleDeleteDialog()
          toggleRefreshFlag()
          toast.success(`Lesson ${data.code ?? ""} deleted successfully`)
        },
        onFailure: (err) => { toast.error(`${err.msg}`)},
        finally: resetDeleteIsLoading
      }
    )
  }

  return (
    
    <>
        <DialogContainer
            title='Delete Lesson'
            description={`Are you sure you want to delete the ${selectedLesson?.title} lesson?`}
            isOpen={deleteDialogIsOpen}
            toggleOpen={toggleDeleteDialog}
        >
            <div className='flex justify-end gap-4 mt-8'>
                <Button className='!h-[35px] px-2' variant='neutral' isLoading={deleteIsLoading} onClick={()=> { toggleDeleteDialog(); resetSelected() }}>Close</Button>
                <Button className='!h-[35px] px-2' variant='danger' isLoading={deleteIsLoading} onClick={handleDeleteLesson}>Delete Lesson</Button>
            </div>
        </DialogContainer>
        <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1'>
          <div className='mt-2 flex h-fit justify-between items-center'>
              <h3 className='text-blue-800'>Module Lessons</h3>
              <div className='flex gap-2 sm:gap-4'>
                <Link to={`/classes/${classCode}/modules/${moduleCode}/lessons/create`}>
                    <Button className='flex px-2 !h-[35px]' > <PlusIcon className='inline w-4 mr-1' /> Create <span className='hidden sm:inline' >&nbsp;a Lesson</span></Button>
                </Link>
                <div className='flex flex-col gap-2 justify-end'>
                    <Button className='!h-[35px] px-2' variant='outline' onClick={manuallyToggleCompositeFilterFlag}> <ArrowPathIcon className='w-4' /> </Button>
                </div>
              </div>
          </div>
          <div className='w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow'>
                    <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
                        <div className = 'w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                            <div className='flex items-center gap-4'>
                                <span className='flex-1 font-normal truncate'>TITLE</span>
                            </div>
                            <div className='flex gap-4 items-center font-light'>
                                <span className='w-[150px] hidden sm:flex justify-end'>AUTHOR</span>
                                <span className='w-[150px] hidden sm:flex justify-end'>LAST UPDATED</span>
                                <span className='w-[100px] flex justify-end'>ACTIONS</span>
                            </div>
                        </div>
                        {
                            lessonsIsLoading && 
                            <div className='w-full h-full m-auto mt-4'>

                                <div
                                    className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                                ></div>
                            </div>
                        } 
                        { 
                            !lessonsIsLoading && lessons.map((lesson, idx) => {
                                return (
                                <Link to={`/classes/${classCode}/modules/${moduleCode}/lessons/${lesson.code}`} key={idx} className = 'cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'>
                                    <div className='flex items-center gap-4'>
                                        <span className='flex-1 font-normal truncate'>{lesson.title}</span>
                                    </div>
                                    <div className='flex gap-4 items-center font-light'>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{lesson.createdBy.firstName + " " + lesson.createdBy.lastName}</span>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{dayjs(lesson.updatedAt).format("HH:mm - DD/MM/YY")}</span>
                                        <span className='w-[100px] flex gap-2 justify-end'>
                                            <Link to={`/classes/${classCode}/modules/${moduleCode}/lessons/${lesson.code}/update`} className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150'>              
                                                <PencilIcon className='w-4 h-4' />
                                            </Link>
                                            <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedLesson(lesson); toggleDeleteDialog() }}>
                                                <TrashIcon className='w-4 h-4' />
                                            </span>
                                        </span>
                                    </div>
                                </Link>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='flex justify-end text-blue-700 mt-2 pb-2'>
                    <p>Showing <span className='font-semibold'>{lessons.length}</span> of <span className='font-semibold'>{lessonsCount}</span></p>
                </div>
            </div>
        </>
    )

}