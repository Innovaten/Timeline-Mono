import { Button, DialogContainer, FileUploader } from '@repo/ui';
import { _getToken, abstractAuthenticatedRequest, cn, useToggleManager } from '@repo/utils'
import { createLazyFileRoute, useRouterState, Outlet, Link } from '@tanstack/react-router'
import { FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useAssignmentSubmissionStatusFilter, useAssignments, useCompositeFilterFlag } from '../hooks';
import dayjs from 'dayjs';
import lodash from 'lodash'

export const Route = createLazyFileRoute('/assignments')({
  component: Assignments
})

function Assignments(){
  const routerState = useRouterState();
  
  if(routerState.location.pathname !== `/assignments`){
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
  
  const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ filterChangedFlag, toggleManager.get('refresh')])

  const { isLoading: assignmentsIsLoading, assignments, count: assignmentsCount } = useAssignments(compositeFilterFlag, 50, 0, filter)

  return (
    <>
        <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1'>
          <div className='mt-2 flex flex-col sm:flex-row h-fit gap-2 sm:justify-between sm:items-center'>
              <h3 className='text-blue-800'>Assignments</h3>
                <div className='flex flex-wrap gap-4'>
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
                      <div className='flex flex-col justify-end'>
                        <Button className='!h-[35px] px-2' variant='outline' onClick={()=>{toggleManager.toggle('refresh')}}> <ArrowPathIcon className='w-4' /> </Button>
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
                                <span className='w-[120px] hidden sm:flex justify-end'>DATE DUE</span>
                            </div>
                        </div>
                        {
                            assignmentsIsLoading && 
                            <div className='w-full h-full m-auto mt-4'>

                                <div
                                    className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                                ></div>
                            </div>
                        } 
                        { 
                            !assignmentsIsLoading && assignments && assignments.length != 0 && assignments.map((assignment, idx) => {
                                return (
                                <Link to={`/classes/${assignment.classCode}/assignments/${assignment.code}`} key={idx} className = 'cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'>
                                    <div className='flex items-center gap-4 truncate'>
                                        <span className='flex-1 font-normal truncate text-ellipsis'>{assignment.title}</span>
                                    </div>
                                    <div className='flex gap-4 items-center font-light'>
                                        <span className='w-[150px] hidden sm:flex justify-end truncate'>{(assignment.createdBy?.firstName ?? "N") + " " + (assignment.createdBy?.lastName ?? "A")}</span>
                                        <span className='w-[120px] hidden sm:flex justify-end'>{dayjs(assignment.endDate).format("HH:mm - DD/MM/YY")}</span>
                                    </div>
                                </Link>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='flex justify-end text-blue-700 mt-2 pb-2'>
                    <p>Showing <span className='font-semibold'>{assignments?.length ?? 0}</span> of <span className='font-semibold'>{assignmentsCount ?? 0}</span></p>
                </div>
            </div>
        </>
    )

}