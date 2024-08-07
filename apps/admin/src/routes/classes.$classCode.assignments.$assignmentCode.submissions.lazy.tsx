import { Button, DialogContainer, FileUploader } from '@repo/ui';
import { _getToken, abstractAuthenticatedRequest, cn, useToggleManager } from '@repo/utils'
import { createLazyFileRoute, useRouterState, Outlet, Link } from '@tanstack/react-router'
import { PlusIcon, ArrowPathIcon, FunnelIcon, PencilIcon, TrashIcon, MegaphoneIcon } from '@heroicons/react/24/outline';
import { useCompositeFilterFlag, useSpecificEntity, useAssignmentStateFilter, useAssignmentsByClass, useAssignmentSubmissions, useAssignmentSubmissionStatusFilter } from '../hooks';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { IAssignmentDoc } from '@repo/models';

export const Route = createLazyFileRoute('/classes/$classCode/assignments/$assignmentCode/submissions')({
  component: AssignmentSubmissions
})

function AssignmentSubmissions(){
  const routerState = useRouterState();
  const { classCode, assignmentCode } = Route.useParams()
  
  if(routerState.location.pathname !== `/classes/${classCode}/assignments/${assignmentCode}/submissions`){
      return <Outlet />
  } 
  
  const initialToggles = {
    'delete-dialog': false,
    'publish-dialog': false,

    'refresh': false,
    'filter-is-shown': false,

    'delete-is-loading': false,
    'publish-is-loading': false,
    }

    type TogglesType = typeof initialToggles
    type ToggleKeys = keyof TogglesType
    const toggleManager = useToggleManager<ToggleKeys>(initialToggles);

  const { changeFilter, filter, filterChangedFlag, filterOptions} = useAssignmentSubmissionStatusFilter()
  
  const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ toggleManager.get('refresh'), filterChangedFlag ])

  const { isLoading: submissionsIsLoading, submissions, count: submissionsCount } = useAssignmentSubmissions(compositeFilterFlag, 50, 0, filter, assignmentCode, false)
    
  return (
    <>
        <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1'>
          <div className='mt-2 flex h-fit justify-between items-center'>
              <h3 className='text-blue-800'>Assignment Submissions</h3>
          </div>
          <div className='w-full mt-3 flex flex-wrap gap-4'>
                    <Button
                        onClick={()=>{ toggleManager.toggle('filter-is-shown')}}
                        variant='outline'
                        className='!h-[35px] px-2 flex items-center gap-2'
                    >
                        <FunnelIcon className='w-4' />
                        { toggleManager.get('filter-is-shown') ? "Close" : "Show"} Filters    
                    </Button>
                    { 
                        toggleManager.get('filter-is-shown') && 
                        <>
                            <div className='flex flex-row items-center gap-2 '>
                                <small className='text-blue-700'>Status</small>
                                <select
                                    className='text-base text-blue-600 border-[1.5px] focus:outline-blue-300 focus:ring-0  rounded-md border-slate-300 shadow-sm h-[35px] px-2'
                                    onChange={(e) => { 
                                        // @ts-ignore
                                        changeFilter(e.target.value)
                                    }}
                                >
                                    { 
                                        filterOptions.map((f, idx) =>{ 
                                            return (
                                                <option key={idx} value={f}>{f}</option>
                                            )
                                        })
                                    }
                                </select> 
                            </div>
                        </>
                    }
              <div className='flex flex-col gap-2 justify-end'>
                  <Button className='!h-[35px] px-2' variant='outline' onClick={manuallyToggleCompositeFilterFlag}> <ArrowPathIcon className='w-4' /> </Button>
              </div>
          </div>
          <div className='w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow'>
                    <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
                        <div className = 'w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                            <div className='flex items-center gap-4'>
                                <span className='flex-1 font-normal truncate'>AUTHOR</span>
                            </div>
                            <div className='flex gap-4 items-center font-light'>
                                <span className='w-[150px] hidden sm:flex justify-end'>STATUS</span>
                                <span className='w-[150px] hidden sm:flex justify-end'>SCORE</span>
                                <span className='w-[120px] hidden sm:flex justify-end'>DATE CREATED</span>
                                {/* <span className='w-[120px] flex justify-end'>ACTIONS</span> */}
                            </div>
                        </div>
                        {
                            submissionsIsLoading && 
                            <div className='w-full h-full m-auto mt-4'>

                                <div
                                    className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                                ></div>
                            </div>
                        }
                        {
                            !submissionsIsLoading && (!submissions || submissions.length == 0 ) &&
                            <div className='w-full h-full m-auto mt-4 flex justify-center'>
                               <span className='text-blue-700 m-auto'>No assignment submissions found</span>
                            </div>
                        }
                        { 
                            !submissionsIsLoading && submissions && submissions.map((submission, idx) => {
                                return (
                                <Link to={`/classes/${classCode}/assignments/${assignmentCode}/submissions/${submission.code}`} key={idx} className = 'cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'>
                                    <div className='flex items-center gap-4 truncate'>
                                        <span className='flex-1 font-normal truncate'>{(submission.submittedBy?.firstName ?? "N") + " " + (submission.submittedBy?.lastName ?? "A")}</span>
                                    </div>
                                    <div className='flex gap-4 items-center font-light'>
                                        <span className='w-[100px] flex items-center gap-2 justify-end'>
                                            {submission.status}
                                            <span className={cn(
                                                "w-2 h-2 rounded-full border-[1px] ",
                                                submission.status == "Pending" && "bg-yellow-600 border-yellow-600",
                                                submission.status == "Submitted" && "border-green-600",
                                                submission.status == "Graded" && "bg-green-600 border-green-600"
                                            )}></span>
                                        </span>
                                        <span className='w-[150px] hidden sm:flex justify-end truncate'>{submission.score}</span>
                                        <span className='w-[120px] hidden sm:flex justify-end'>{dayjs(submission.createdAt).format("HH:mm - DD/MM/YY")}</span>
                                    </div>
                                </Link>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='flex justify-end text-blue-700 mt-2 pb-2'>
                    <p>Showing <span className='font-semibold'>{submissions.length}</span> of <span className='font-semibold'>{submissionsCount}</span></p>
                </div>
            </div>
        </>
    )

}