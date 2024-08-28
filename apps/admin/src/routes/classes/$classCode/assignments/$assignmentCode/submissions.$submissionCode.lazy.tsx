import { Button, DialogContainer, Input } from '@repo/ui';
import { _getToken, abstractAuthenticatedRequest, useToggleManager } from '@repo/utils'
import { createLazyFileRoute, useRouterState, Outlet, Link } from '@tanstack/react-router'
import dayjs from 'dayjs';
import { useAssignmentSubmission } from '../../../../../hooks';
import { PhotoIcon, DocumentIcon, PaperClipIcon, ShareIcon } from   '@heroicons/react/24/outline'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/classes/$classCode/assignments/$assignmentCode/submissions/$submissionCode')({
  component: Assignments
})

function Assignments(){
  const routerState = useRouterState();
  const { classCode, assignmentCode, submissionCode } = Route.useParams()

  const navigate = Route.useNavigate()

  if(routerState.location.pathname !== `/classes/${classCode}/assignments/${assignmentCode}/submissions/${submissionCode}`){
    return <Outlet />
  } 

  const initialToggles = {
    'grade-is-loading': false,
    'grade-dialog': false,
  }

  type TogglesType = typeof initialToggles
  type ToggleKeys = keyof TogglesType
  const toggleManager = useToggleManager<ToggleKeys>(initialToggles);

  const { isLoading, assignment, submission } = useAssignmentSubmission(true, assignmentCode, submissionCode, false)
  
  function GradeAssignmentDialog(){

    function handleGradeSubmit(values: {
      score: number,
      feedback: string,
    }) {
      abstractAuthenticatedRequest(
        "post",
        `/api/v1/assignments/${assignmentCode}/submissions/${submissionCode}?isId=false`,
        values,
        {},
        {
          onStart: ()=> {toggleManager.toggle('grade-is-loading')},
          onSuccess: (data) => {
            toast.success("Assignment graded successfully"),
            toggleManager.reset('grade-dialog')
            navigate({
              to: `/classes/${classCode}/assignments/${assignmentCode}/submissions/`
            })
          },
          onFailure: (err) => {
            toast.error(`${err.message ? err.message : err}`)
          },
          finally: ()=>{ toggleManager.reset('grade-is-loading')}
        }
      )

    }
    const gradeFormInitialValues = {
      score: submission?.score ?? 0,
      feedback: submission?.feedback ?? ""
    }

    const gradeValidationSchema = Yup.object({
      score: Yup.number()
        .required("Submission score is required")
        .min(0, "Kindly enter a value greater than 0")
        .max(assignment?.maxScore ?? 0, `Score cannot be greater than ${ assignment?.maxScore ?? 'assignment max score'}`),
      feedback: Yup.string().optional().min(3, "Feedback is too short").max(1024, "Feedback is too long")
    })

    return (
      <DialogContainer
        isOpen={toggleManager.get('grade-dialog')}
        toggleOpen={()=>{ toggleManager.reset('grade-dialog')}}
        title='Grade Assignment Submission'
        description={`Grade ${submission?.submittedBy?.firstName} ${submission?.submittedBy?.lastName}'s assignment submission`}
      >
        <div>
          <Formik
            initialValues={gradeFormInitialValues}
            validationSchema={gradeValidationSchema}
            onSubmit={handleGradeSubmit}
          >
            <Form
              className='flex flex-col gap-y-6 '
            >
              <Input
                label='Feedback'
                name='feedback'
                hasValidation
              />
              <Input
                label='Score'
                name='score'
                hasValidation
                max={assignment?.maxScore}
                min={0}
                type='number'
                step={1}
              />
              <span className=' text-blue-700 shrink-0'>
              {`Out of ${assignment?.maxScore ?? 0}`}
              </span>
              <div className='flex h-16 flex-shrink-0 justify-end items-center w-full gap-4'>
                <Button
                    variant='neutral' 
                    isDisabled={toggleManager.get('grade-is-loading')} 
                    type='button' 
                    onClick={()=>{ toggleManager.reset('grade-dialog')}}
                >Close</Button>
                <Button
                    type='submit'
                    isLoading={toggleManager.get('grade-is-loading')} 

                >Grade Assignment</Button>
              </div>
            </Form>
          </Formik>

        </div>

      </DialogContainer>
    )
  }

  return (
    <>
      {toggleManager.get('grade-dialog') && <GradeAssignmentDialog />}
        <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1'>
            { isLoading &&
                <div className='w-full h-full m-auto mt-4'>
                    <div
                        className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                    ></div>
                </div>
            }

            { !isLoading && assignment && submission &&
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
                        </span>
                        <span className='mt-3 flex gap-2 flex-wrap items-center'>
                            <span className='bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                                <span>Submitted By:</span>
                                <span className='font-light'>{submission.submittedBy?.firstName + " " + submission.submittedBy?.lastName}</span>
                            </span>
                            <span className='bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm'>
                                <span>Date Submitted:</span>
                                <span className='font-light'>{dayjs(submission.submittedAt).format("HH:mm - DD/MM/YY")}</span>
                            </span>
                        </span>
                    </div>
                    <span className='mt-4 text-blue-700 font-light'>Instructions</span>
                    <div className='flex-1 overflow-y-auto' >
                      <div className='text-blue-700' dangerouslySetInnerHTML={{ __html: assignment.instructions }}></div>
                      <div className='mt-4 flex flex-col sm:flex-row gap-4 sm:gap-2 sm:justify-between sm:items-end '>
                      {
                          assignment.resources && 
                          <>
                              <div className='flex-1'>
                                  <span className='mt-4 text-blue-700 font-light'>Resources</span>
                                  <div className='mt-2 grid grid-cols-1 text-blue-700 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-2'>
                                      {!!assignment.resources && assignment.resources?.map((resource, idx) => {
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
                                                      <p className='font-light truncate'>{decodeURIComponent(resource.title)}</p>
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
                          submission.resources && 
                          <>
                              <div className='flex-1'>
                                  <span className='mt-4 text-blue-700 font-light'>Submission Documents</span>
                                  <div className='mt-2 grid grid-cols-1 text-blue-700 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-2'>
                                      { !!submission.resources && submission.resources?.map((resource, idx) => {
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
                                                      <p className='font-light truncate'>{decodeURIComponent(resource.title)}</p>
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
                          submission.status == "Graded" && 
                          <>
                              <div className='flex-1'>
                                  <span className='mt-4 text-blue-700 font-light'>Grade Details</span>
                                  <div className='mt-3 flex flex-col gap-2 bg-blue-300/10 border-blue-600/10 border-[1.5px] p-2'>
                                    <span className='flex gap-1 text-blue-700 items-center'>
                                      <span>Graded By:</span>
                                      <span className='font-light'>{submission.gradedBy?.firstName + " " + submission.gradedBy?.lastName}</span>
                                    </span>
                                    <span className='flex gap-1 text-blue-700 items-center'>
                                      <span>Feedback Provided:</span>
                                      <span className='font-light'>{submission.feedback}</span>
                                    </span>
                                    <span className='flex gap-1 text-blue-700 items-center'>
                                      <span>Score Allocated:</span>
                                      <span className='font-light'>{submission.score}/{assignment.maxScore}</span>
                                    </span>
                                  </div>
                              </div>
                          </>
                      }
                      </div>
                    </div>
                    <div className='w-full shrink-0 flex flex-col sm:justify-end sm:items-center sm:flex-row gap-4'>    
                      { submission.status == "Graded" &&
                        <div className='text-blue-600 font-medium'>
                          Graded at {dayjs(submission.gradedAt).format("HH:mm - DD/MM/YYYY")}
                        </div>
                      }
                        <div>
                            <Button
                              variant={submission.status == "Graded" ? "neutral" : "primary"}
                              onClick={()=> toggleManager.toggle('grade-dialog')}
                               className=''
                            >{submission.status == "Graded" ? 'Reg' : 'G'}rade Assignment</Button>
                        </div>    
                    </div>
                    
                </div>
            }
         </div>
        </>
    )

}