import { Button, DialogContainer } from '@repo/ui';
import { abstractAuthenticatedRequest, useToggleManager } from '@repo/utils'
import { createLazyFileRoute, useRouterState, Outlet, Link } from '@tanstack/react-router'
import { PlusIcon, ArrowPathIcon, FunnelIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCompositeFilterFlag, useAnnouncements, useSpecificEntity } from '../hooks';
import dayjs from 'dayjs';
import { IAnnouncementDoc } from '@repo/models';
import { toast } from 'sonner';
import { useLMSContext } from '../app';

export const Route = createLazyFileRoute('/announcements')({
  component: Announcements
})

function Announcements({ }){
  const routerState = useRouterState();

  if(routerState.location.pathname !== "/announcements"){
    return <Outlet />
  } 

  const { user } = useLMSContext()

  const initialToggles = {
    'delete-dialog': false,
    'delete-is-loading': false,

    'filter-is-shown': false,
    'refresh': false,
  }

  type TogglesType = typeof initialToggles
  type ToggleKeys = keyof TogglesType
  const toggleManager = useToggleManager<ToggleKeys>(initialToggles);

  const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ toggleManager.get('refresh') ])
  const { isLoading: announcementsIsLoading, announcements, count: announcementsCount } = useAnnouncements(compositeFilterFlag, 50, 0,{
    createdBy: user?.id,
  })
  
  const { entity: selectedAnnouncement, setSelected: setSelectedAnnouncement, resetSelected} = useSpecificEntity<IAnnouncementDoc>();



  function DeleteDialog(){
 
    function handleDeleteAnnouncement(){
      if(!selectedAnnouncement) return 
  
      abstractAuthenticatedRequest(
        "delete",
        `/api/v1/announcements/${selectedAnnouncement._id}`,
        {},
  
        {},
        {
          onSuccess: (data) => {
            toast.success(`Announcement ${data.code ?? ""} deleted successfully`)
          },
          onFailure: (error) => {
              toast.error(`${error.msg}`)
          },
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
                <Button className='!h-[35px] px-2' 
                  variant='neutral' 
                  isDisabled={toggleManager.get('delete-is-loading')} 
                  onClick={()=> { toggleManager.reset('delete-dialog'); resetSelected() }}
                >Close</Button>
                <Button className='!h-[35px] px-2' 
                  variant='danger' 
                  isLoading={toggleManager.get('delete-is-loading')} 
                  onClick={handleDeleteAnnouncement}
                >Delete Announcement</Button>
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
              <h3 className='text-blue-800'>All Announcements</h3>
          </div>
          <div className='w-full mt-3 flex flex-wrap gap-4'>
                    <Button
                        onClick={()=>{toggleManager.toggle('filter-is-shown') }}
                        variant='outline'
                        className='!h-[35px] px-2 flex items-center gap-2'
                    >
                        <FunnelIcon className='w-4' />
                        { toggleManager.get('filter-is-shown') ? "Close" : "Show"} Filters    
                    </Button>
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
                                <div key={idx} className = 'cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'>
                                    <div className='flex items-center gap-4'>
                                        <span className='flex-1 font-normal truncate'>{announcement.title}</span>
                                    </div>
                                    <div className='flex gap-4 items-center font-light'>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{announcement.createdBy.firstName + " " + announcement.createdBy.lastName}</span>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{dayjs(announcement.createdAt).format("HH:mm - DD/MM/YY")}</span>
                                        <span className='w-[100px] flex justify-end'>
                                            {/* <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={() => { setSelectedAdmin(admin); toggleUpdateDialog() }}>              
                                                <PencilIcon className='w-4 h-4' />
                                            </span> */}
                                            <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={() => { setSelectedAnnouncement(announcement); toggleManager.toggle('delete-dialog') }}>
                                                <TrashIcon className='w-4 h-4' />
                                            </span>
                                        </span>
                                    </div>
                                </div>
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