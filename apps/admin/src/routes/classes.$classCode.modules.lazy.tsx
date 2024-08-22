import { Button, DialogContainer, FileUploader } from '@repo/ui';
import { _getToken, abstractAuthenticatedRequest, useDialog, useFileUploader, useLoading } from '@repo/utils'
import { createLazyFileRoute, useRouterState, Outlet, Link } from '@tanstack/react-router'
import { PlusIcon, ArrowPathIcon, FunnelIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCompositeFilterFlag, useModules, useSpecificEntity, useModuleStateFilter } from '../hooks';
import { Input } from '@repo/ui'
import { Formik, Form } from 'formik'
import dayjs from 'dayjs';
import { IModuleDoc } from '@repo/models';
import { toast } from 'sonner';
import { useLMSContext } from '../app';
import * as Yup from 'yup'

export const Route = createLazyFileRoute('/classes/$classCode/modules')({
  component: Lessons
})

function Lessons({ }){
  const routerState = useRouterState();
  const { classCode } = Route.useParams()
  const filesHook = useFileUploader();

  if(routerState.location.pathname !== `/classes/${classCode}/modules`){
    return <Outlet />
  } 

  const { user } = useLMSContext()

  const { toggleDialog: toggleDeleteDialog, dialogIsOpen: deleteDialogIsOpen } = useDialog();
  const { toggleDialog: toggleCreateDialog, dialogIsOpen: createDialogIsOpen } = useDialog();
  const { dialogIsOpen: refreshFlag, toggleDialog: toggleRefreshFlag } = useDialog();
  const { dialogIsOpen: filterIsShown, toggleDialog: toggleFiltersAreShown } = useDialog();
  const { isLoading: deleteIsLoading, resetLoading: resetDeleteIsLoading, toggleLoading: toggleDeleteIsloading } = useLoading()
  
  const { changeFilter, filter, filterChangedFlag, filterOptions} = useModuleStateFilter()
  
  const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ refreshFlag, filterChangedFlag ])

  const { isLoading: modulesIsLoading, modules, count: modulesCount } = useModules(compositeFilterFlag, 50, 0, classCode, {
      ...filter,
      user,
    })
    
  const { entity: selectedModule, setSelected: setSelectedModule, resetSelected} = useSpecificEntity<IModuleDoc>();

  function handleCreateModule(values: {
    title: string,
  }) {

    abstractAuthenticatedRequest(
        "post",
        "/api/v1/modules",
        {
            title: values.title,
            classCode: classCode,
            resources: filesHook.files.map(f => f._id),
            authToken: _getToken(),
        },
        {},
        {
            onStart: toggleDeleteIsloading,
            onSuccess: (data)=>{ 
                toast.success("Module created successfully")
                toggleCreateDialog()
                toggleRefreshFlag()
            },
            onFailure: (err) =>{ toast.error(`${err.msg}`) },
            finally: resetDeleteIsLoading,
        }
    )
    }
  function handleDeleteModule(){
    
    if(!selectedModule) return 
    
    abstractAuthenticatedRequest(
      "delete",
      `/api/v1/modules/${selectedModule._id}?classCode=${classCode}`,
      {},
      {},
      {
        onStart: toggleDeleteIsloading,
        onSuccess: (data) => {
          resetSelected()
          toggleDeleteDialog()
          toggleRefreshFlag()
          toast.success(`Module ${data.code ?? ""} deleted successfully`)
        },
        onFailure: (err) => { toast.error(`${err.msg}`)},
        finally: resetDeleteIsLoading
      }
    )
  }
  const InitialValues  = {
    title: "",
}
  return (
    <>
        <DialogContainer
            title='Delete Module'
            description={`Are you sure you want to delete the ${selectedModule?.title} lesson?`}
            isOpen={deleteDialogIsOpen}
            toggleOpen={toggleDeleteDialog}
        >
            <div className='flex justify-end gap-4 mt-8'>
                <Button className='!h-[35px] px-2' variant='neutral' isLoading={deleteIsLoading} onClick={()=> { toggleDeleteDialog(); resetSelected() }}>Close</Button>
                <Button className='!h-[35px] px-2' variant='danger' isLoading={deleteIsLoading} onClick={handleDeleteModule}>Delete Module</Button>

            </div>
        </DialogContainer>

        <DialogContainer
            title='Create Module'
            description={`Create a new module for class ${classCode}`}
            isOpen={createDialogIsOpen}
            toggleOpen={toggleCreateDialog}
        >
            <Formik 
                initialValues={InitialValues}
                validationSchema={createModuleValidationSchema}
                onSubmit={handleCreateModule}
                
                >
            { form => {
                return (
                    <>
            <div className='flex justify-end gap-4 mt-8'>
                    <Form className='flex flex-col gap-6 w-full'>
                    <Input name='title' label='Module Name' hasValidation />
                </Form>
               
            </div>
            <div className='flex justify-end gap-4 mt-8'>
                <Button className='!h-[35px] w-24 px-2' onClick={form.submitForm}>Save</Button>
                <FileUploader filesHook={filesHook} buttonVariant='outline'/>
            </div>
            </>
            )
            }}
            </Formik>
        </DialogContainer>


        <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1'>
          <div className='mt-2 flex h-fit justify-between items-center'>
              <h3 className='text-blue-800'>Class Modules</h3>
              <Link to={`/classes/${classCode}/modules/create`}>
                <Button className='flex px-2 !h-[35px]' onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCreateDialog() }}> <PlusIcon className='inline w-4 mr-1' /> Create <span className='hidden sm:inline' >&nbsp;a Module</span></Button>
              </Link>
          </div>
          <div className='w-full mt-3 flex flex-wrap gap-4'>
                    <Button
                        onClick={toggleFiltersAreShown}
                        variant='outline'
                        className='!h-[35px] px-2 flex items-center gap-2'
                    >
                        <FunnelIcon className='w-4' />
                        { filterIsShown ? "Close" : "Show"} Filters    
                    </Button>
                    { 
                        filterIsShown && 
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
                            modulesIsLoading && 
                            <div className='w-full h-full m-auto mt-4'>

                                <div
                                    className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                                ></div>
                            </div>
                        } 
                        { 
                            !modulesIsLoading && modules.map((module, idx) => {
                                return (
                                <Link to={`/classes/${classCode}/modules/${module.code}`} key={idx} className = 'cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'>
                                    <div className='flex items-center gap-4'>
                                        <span className='flex-1 font-normal truncate'>{module.title}</span>
                                    </div>
                                    <div className='flex gap-4 items-center font-light'>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{module.createdBy.firstName + " " + module.createdBy.lastName}</span>
                                        <span className='w-[150px] hidden sm:flex justify-end'>{dayjs(module.createdAt).format("HH:mm - DD/MM/YY")}</span>
                                        <span className='w-[100px] flex gap-2 justify-end'>
                                            <Link to={`/classes/${classCode}/modules/${module.code}/update`} className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150'>              
                                                <PencilIcon className='w-4 h-4' />
                                            </Link>
                                            <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedModule(module); toggleDeleteDialog() }}>
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
                    <p>Showing <span className='font-semibold'>{modules.length}</span> of <span className='font-semibold'>{modulesCount}</span></p>
                </div>
            </div>
        </>
    )

}

const createModuleValidationSchema = Yup.object({
    title: Yup.string().required("Module name is required").min(4, "Module is too short").max(256, "Module name is too long"),
})