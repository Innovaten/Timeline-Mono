import { Button, DialogContainer, FileUploader } from '@repo/ui';
import { _getToken, abstractAuthenticatedRequest, useFileUploader, useToggleManager } from '@repo/utils'
import { createLazyFileRoute, useRouterState, Outlet, Link } from '@tanstack/react-router'
import dayjs from 'dayjs';
import { useAssignment } from '../../../../hooks';
import { PhotoIcon, DocumentIcon, PaperClipIcon, ShareIcon, ExclamationTriangleIcon } from   '@heroicons/react/24/outline'
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/classes/$classCode/assignments/$assignmentCode')({
  component: Assignments
})

function Assignments(){
  const routerState = useRouterState();
  const { classCode, assignmentCode } = Route.useParams()

  if(routerState.location.pathname !== `/classes/${classCode}/assignments/${assignmentCode}`){
    return <Outlet />
  } 

  
  const filesHook = useFileUploader();


  const initialToggles = {
    'submit-is-loading': false,

    'submit-dialog': false,
  }

  type TogglesType = typeof initialToggles
  type ToggleKeys = keyof TogglesType
  const toggleManager = useToggleManager<ToggleKeys>(initialToggles);

  function SubmitDialog(){

    function handleSubmitAssignment(){
    
        abstractAuthenticatedRequest(
          "post",
          `/api/v1/assignments/${assignmentCode}/submissions?isId=false`,
          {
            resources: filesHook.files.map(resource => `${resource._id}`),
            authToken: _getToken()
          },
          {},
          {
            onStart: ()=>{ toggleManager.toggle(('submit-is-loading')) },
            onSuccess: (data) => {
              toggleManager.reset('submit-dialog')
              toast.success(`Assignment submitted successfully`)
            },
            onFailure: (err) => { toast.error(`${err.msg}`)},
            finally: ()=>{ toggleManager.reset('submit-is-loading') }
          }
        )
      }

    return (
        <>
            <DialogContainer
            title='Submit Assignment'
            description={`Upload your submission documents below`}
            isOpen={toggleManager.get('submit-dialog')}
            toggleOpen={()=>{ toggleManager.toggle('submit-dialog')}}
            >
                <div className='flex h-fit max-h-[70vh] overflow-y-auto'>
                  {
                    filesHook.files.length == 0 && 
                    <div className='flex gap-2 w-full p-2 rounded-sm text-yellow-500 bg-yellow-300/10 border-[1.5px] border-yellow-600/10 ' >
                      <ExclamationTriangleIcon className='w-5' />
                      No files uploaded
                    </div>
                    }

                    {filesHook.files && filesHook.files.map((f, idx) => {
                      return (
                          <a className='flex w-full gap-2 p-2 rounded-sm bg-blue-300/10 border-[1.5px] border-blue-600/10 ' target='_blank' href={f.link} key={idx}>
                            { f.type == "Image" &&
                                <PhotoIcon className='w-4 shrink-0' />
                            }
                            { f.type == "Document" &&
                                <DocumentIcon className='w-4 shrink-0' />
                            }
                            { f.type == "Link" &&
                                <ShareIcon className='w-4 shrink-0' />
                            }
                            { f.type == "Other" &&
                                <PaperClipIcon className='w-4 shrink-0' />
                            }
                            <p className='font-light truncate'>{f.title}</p>
                        </a>
                      )
                    })}
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4 mt-8'>
                  <div>
                    <FileUploader filesHook={filesHook} buttonClass="w-full sm:w-fit" buttonVariant='outline' />
                  </div>
                  <div className='flex flex-col-reverse sm:flex-row gap-2 sm:gap-4'>
                      <Button className='!h-[35px] px-2' 
                        variant='neutral' 
                        isDisabled={toggleManager.get('submit-is-loading')} 
                        onClick={()=> { toggleManager.reset('submit-dialog');}}
                      >Close</Button>
                      <Button className='!h-[35px] px-2' 
                        isDisabled={filesHook.files.length === 0} 
                        isLoading={toggleManager.get('submit-is-loading')} 
                        onClick={handleSubmitAssignment}
                      >Submit Assignment</Button>
                  </div>
                </div>
            </DialogContainer>
        </>
    )
  }


  const { isLoading, assignment, submission } = useAssignment(true, assignmentCode, false)
  return (
    <>
        { toggleManager.get('submit-dialog') && <SubmitDialog /> }
        <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1'>
            { isLoading &&
                <div className='w-full h-full m-auto mt-4'>
                    <div
                        className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                    ></div>
                </div>
            }

            { !isLoading && assignment &&
              <div className='flex flex-col gap-2 flex-1'>
                    <div className='mt-2'>
                        <h3 className='text-blue-800'>{assignment.title}</h3>
                        <span className='mt-3 flex gap-2 flex-wrap items-center'>
                            <span className='bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                                <span>Author:</span>
                                <span className='font-light'>{assignment.createdBy?.firstName + " " + assignment.createdBy?.lastName}</span>
                            </span>
                            <span className='bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                                <span>Created:</span>
                                <span className='font-light'>{dayjs(assignment.createdAt).format("HH:mm - DD/MM/YY")}</span>
                            </span>
                            { assignment.createdAt != assignment.updatedAt && 
                                <span className='bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                                    <span>Updated:</span>
                                    <span className='font-light'>{dayjs(assignment.updatedAt).format("HH:mm - DD/MM/YY")}</span>
                                </span>
                            }
                            <span className='bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                                <span>Open Date:</span>
                                <span className='font-light'>{dayjs(assignment.startDate).format("HH:mm - DD/MM/YY")}</span>
                            </span>
                            <span className='bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                                <span>Due Date:</span>
                                <span className='font-light'>{dayjs(assignment.endDate).format("HH:mm - DD/MM/YY")}</span>
                            </span>
                        </span>
                    </div>
                    <span className='mt-4 text-blue-700 font-light'>Instructions</span>
                    <div className='flex-1 overflow-y-auto' >
                      <div className='flex-1 overflow-y-auto text-blue-700' dangerouslySetInnerHTML={{ __html: assignment.instructions }}></div>
                      <div className='mt-4 flex flex-col sm:flex-row gap-4 sm:gap-2 sm:justify-between sm:items-end '>
                      {
                        assignment.resources && 
                        <>
                              <div className='flex-1'>
                                  <span className='mt-4 text-blue-700 font-light'>Resources</span>
                                  <div className='mt-2 grid grid-cols-1 text-blue-700 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-2'>
                                      { assignment.resources && assignment.resources.length > 0 && assignment.resources.map((resource, idx) => {
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
                                        (!assignment.resources || assignment.resources.length == 0 ) && 
                                         <>
                                          <div className='flex gap-2 p-2 rounded-sm bg-blue-300/10 border-[1.5px] border-blue-600/10 '>
                                              <PaperClipIcon className='w-4 shrink-0' />                                            
                                              <p className='font-light'>No resources</p>
                                          </div>
                                         </>
                                      }
                                  </div>    
                              </div>
                          </>
                      }
                      </div>
                      <div className='mt-4 flex flex-col sm:flex-row gap-4 sm:gap-2 sm:justify-between sm:items-end '>
                      {
                          submission && submission.resources && 
                          <>
                              <div className='flex-1'>
                                  <span className='mt-4 text-blue-700 font-light'>Submission Documents</span>
                                  <div className='mt-2 grid grid-cols-1 text-blue-700 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-2'>
                                      { submission?.resources && submission.resources.map((resource, idx) => {
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
                                  </div>    
                              </div>
                          </>
                      }
                      </div>
                      <div className='mt-4 flex flex-col sm:flex-row gap-4 sm:gap-2 sm:justify-between sm:items-end '>
                      {
                          submission && submission.status == "Graded" && 
                          <>
                              <div className='flex-1'>
                                  <span className='mt-4 text-blue-700 font-light'>Grade Details</span>
                                  <div className='mt-3 flex flex-col gap-2 bg-blue-300/10 border-blue-600/10 border-[1.5px] p-2'>
                                    <span className='flex gap-1 text-blue-700 items-center'>
                                      <span>Graded By:</span>
                                      <span className='font-light'>{submission.gradedBy?.firstName + " " + submission.gradedBy?.lastName}</span>
                                    </span>
                                    <span className='flex gap-1 items-center text-blue-700'>
                                      <span>Feedback Provided:</span>
                                      <span className='font-light'>{submission.feedback}</span>
                                    </span>
                                    <span className=' flex gap-1 items-center text-blue-700'>
                                      <span>Score Allocated:</span>
                                      <span className='font-light'>{submission.score}/{assignment.maxScore}</span>
                                    </span>
                                  </div>
                              </div>
                          </>
                      }
                      </div>
                    </div>
                  <div className='w-full shrink-0 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2'>
                    {
                      submission ? 
                      <div className='text-blue-600 sm:text-right font-medium'>
                        Submitted at {dayjs(submission.submittedAt).format("HH:mm - DD/MM/YYYY")}
                      </div>
                      : new Date() > new Date(assignment.endDate) ? 
                      <div className='text-red-600 sm:text-right font-medium'>
                        Assignment deadline passed ({dayjs(assignment.endDate).format("HH:mm - DD/MM/YYYY") })
                      </div>
                      :
                      <div>
                          <Button
                              className='w-full'
                              onClick={()=>{ toggleManager.toggle('submit-dialog')}}
                          >Submit Assignment</Button>
                      </div>    
                    }

                  </div>

              </div>
            }
         </div>
        </>
    )

}