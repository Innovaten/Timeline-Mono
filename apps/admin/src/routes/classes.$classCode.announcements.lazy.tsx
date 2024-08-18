import { Button, DialogContainer, FileUploader } from '@repo/ui';
import { _getToken, abstractAuthenticatedRequest, useDialog, useFileUploader, useLoading, useToggleManager } from '@repo/utils'
import { createLazyFileRoute, useRouterState, Outlet, Link } from '@tanstack/react-router'
import { PlusIcon, ArrowPathIcon, FunnelIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCompositeFilterFlag, useAnnouncements, useSpecificEntity } from '../hooks';
import dayjs from 'dayjs';
import { IAnnouncementDoc } from '@repo/models';
import { toast } from 'sonner';
import { useLMSContext } from '../app';
import { useAnnouncementStateFilter } from '../hooks/announcements.hook,';

export const Route = createLazyFileRoute('/classes/$classCode/announcements')({
  component: Announcements
})

function Announcements({ }){
  const routerState = useRouterState();
  const { classCode } = Route.useParams()
  
  if(routerState.location.pathname !== `/classes/${classCode}/announcements`){
      return <Outlet />
  } 
  
  const { user } = useLMSContext()
  const filesHook = useFileUploader();
  
  const initialToggles = {
    'delete-dialog': false,

    'refresh': false,
    'filter-is-shown': false,

    'delete-is-loading': false
    }

    type TogglesType = typeof initialToggles
    type ToggleKeys = keyof TogglesType
    const toggleManager = useToggleManager<ToggleKeys>(initialToggles);

  const { changeFilter, filter, filterChangedFlag, filterOptions} = useAnnouncementStateFilter()
  
  const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ toggleManager.get('refresh'), filterChangedFlag ])

  const { isLoading: announcementsIsLoading, announcements, count: announcementsCount } = useAnnouncements(compositeFilterFlag, 50, 0, {
      ...filter,
    })
    
  const { entity: selectedAnnouncement, setSelected: setSelectedAnnouncement, resetSelected} = useSpecificEntity<IAnnouncementDoc>();


  function DeleteDialog(){

    function handleDeleteAnnouncement(){
        if(!selectedAnnouncement) return 
    
        abstractAuthenticatedRequest(
          "delete",
          `/api/v1/announcements/${selectedAnnouncement._id}?classCode=${classCode}`,
          {},
          {},
          {
            onStart: ()=>{ toggleManager.toggle(('delete-is-loading')) },
            onSuccess: (data) => {
              resetSelected()
              toggleManager.reset('delete-dialog')
              toggleManager.toggle('refresh')
              toast.success(`Announcement ${data.code ?? ""} deleted successfully`)
            },
            onFailure: (err) => { toast.error(`${err.msg}`)},
            finally: ()=>{ toggleManager.toggle('delete-is-loading') }
          }
        )
      }

    return (
        <>
            <DialogContainer
            title='Delete Announcement'
            description={`Are you sure you want to delete the ${selectedAnnouncement?.title} announcement?`}
            isOpen={toggleManager.get('delete-dialog')}
            toggleOpen={()=>{ toggleManager.toggle('delete-dialog')}}
            >
                <div className='flex justify-end gap-4 mt-8'>
                    <Button className='!h-[35px] px-2' variant='neutral' isDisabled={toggleManager.get('delete-is-loading')} onClick={()=> { toggleManager.reset('delete-dialog'); resetSelected() }}>Close</Button>
                    <Button className='!h-[35px] px-2' variant='danger' isLoading={toggleManager.get('delete-is-loading')} onClick={handleDeleteAnnouncement}>Delete Announcement</Button>
                </div>
            </DialogContainer>
        </>
    )
  }

  return (
    <>
        <DeleteDialog />
        <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1'>
          <div className='mt-2 flex h-fit justify-between items-center'>
              <h3 className='text-blue-800'>Class Announcements</h3>
              <Link to={`/classes/${classCode}/announcements/create`}>
                <Button className='flex px-2 !h-[35px]' > <PlusIcon className='inline w-4 mr-1' /> Create <span className='hidden sm:inline' >&nbsp;an Announcement</span></Button>
              </Link>
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
                                <span className='flex-1 font-normal truncate'>TITLE</span>
                            </div>
                            <div className='flex gap-4 items-center font-light'>
                                <span className='w-[150px] hidden sm:flex justify-end'>AUTHOR</span>
                                <span className='w-[150px] hidden sm:flex justify-end'>DATE CREATED</span>
                                <span className='w-[100px] flex justify-end'>ACTIONS</span>
                            </div>
                        </div>
                        {
                            announcementsIsLoading && 
                            <div className='w-full h-full m-auto mt-4'>

                                <div
                                    className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                                ></div>
                            </div>
                        } 
                        { 
                            !announcementsIsLoading && announcements.map((announcement, idx) => {
                                return (
                                <Link to={`/classes/${classCode}/announcements/${announcement.code}`} key={idx} className = 'cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'>
                                    <div className='flex items-center gap-4'>
                                        <span className='flex-1 font-normal truncate'>{announcement.title}</span>
                                    </div>
                                    <div className='flex gap-4 items-center font-light'>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{announcement.createdBy.firstName + " " + announcement.createdBy.lastName}</span>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{dayjs(announcement.createdAt).format("HH:mm - DD/MM/YY")}</span>
                                        <span className='w-[100px] flex gap-2 justify-end'>
                                            <Link to={`/classes/${classCode}/announcements/${announcement.code}/update`} className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150'>              
                                                <PencilIcon className='w-4 h-4' />
                                            </Link>
                                            <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedAnnouncement(announcement); toggleManager.toggle('delete-dialog') }}>
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
                    <p>Showing <span className='font-semibold'>{announcements.length}</span> of <span className='font-semibold'>{announcementsCount}</span></p>
                </div>
            </div>
        </>
    )

}