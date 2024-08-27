import { Button, DialogContainer, Input } from '@repo/ui';
import { createLazyFileRoute, Link, useRouterState, Outlet } from '@tanstack/react-router';
import { PlusIcon, ArrowPathIcon, FunnelIcon, TrashIcon, EyeIcon, PencilIcon, UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline'
import * as yup from 'yup'
import { _getToken, abstractAuthenticatedRequest, makeAuthenticatedRequest, useToggleManager } from '@repo/utils';
import { Formik, Form } from 'formik'
import { SelectInput } from '@repo/ui';
import { toast } from 'sonner'
import { useAdministrators, useClasses, useCompositeFilterFlag, useSpecificEntity } from '../hooks';
import { useClassesAssignedStatusFilter, useClassesModeOfClassFilter, useClassesStatusFilter } from '../hooks/classes.hook';
import { IClassDoc } from '@repo/models';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { IUserDoc } from '@repo/models';
import { useLMSContext } from '../app';

export const Route = createLazyFileRoute('/classes')({
    component: Classes
})


function Classes(){
    const routerState = useRouterState();

    if(routerState.location.pathname !== "/classes"){
        return <Outlet />
      } 

    const { user } = useLMSContext() 

    const { filter: AssignedStatusFilter, filterOptions: AssignedStatusFilterOptions, changeFilter: AssignedStatusChangeFilter, filterChangedFlag: AssignedStatusFilterChangedFlag } = useClassesAssignedStatusFilter();
    const { filter: ModeOfClassFilter, filterOptions: ModeOfClassFilterOptions, changeFilter: ModeOfClassChangeFilter, filterChangedFlag: ModeOfClassFilterChangedFlag } = useClassesModeOfClassFilter();
    // const { filter: StatusFilter, filterOptions: StatusFilterOptions, changeFilter: StatusChangeFilter, filterChangedFlag: StatusFilterChangedFlag } = useClassesStatusFilter();
    
    const initialToggles = {
        'create-dialog': false,
        'assign-dialog': false,
        'update-dialog': false,
        'delete-dialog': false,
        'remove-admin-dialog': false,

        'filter-is-shown': false,

        'create-is-loading': false,
        'assign-is-loading': false,
        'update-is-loading': false,
        'delete-is-loading': false,
        'remove-admin-is-loading': false,
    }

    type TogglesType = typeof initialToggles
    type ToggleKeys = keyof TogglesType
    const toggleManager = useToggleManager<ToggleKeys>(initialToggles);

    const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ AssignedStatusFilterChangedFlag, /*StatusFilterChangedFlag,*/ ModeOfClassFilterChangedFlag])

    const { isLoading: classesIsLoading, classes, count: classesCount } = useClasses(compositeFilterFlag, {
      ...AssignedStatusFilter,
      ...ModeOfClassFilter,
    //   ...StatusFilter,
    });

    
    const { entity: selectedClass, setSelected: setSelectedClass, resetSelected: resetSelectedClass } = useSpecificEntity<Partial<IClassDoc>>()
    
    const updateClassInitialValues = {
        name: selectedClass?.name!,
        modeOfClass: selectedClass?.modeOfClass!,
    }



    function CreateDialog(){

        function handleCreateClassSubmit(values:{
            name: string,
            modeOfClass: string
        }){
            toggleManager.toggle('create-is-loading')
            
            makeAuthenticatedRequest(
                "post",
                "/api/v1/classes",
                {
                    ...values,
                    authToken: _getToken(),
                },
            )
            .then(res => {
                if(res.status == 201 && res.data.success){
                    toggleManager.reset('create-dialog')
                    manuallyToggleCompositeFilterFlag()
                    toast.success("Class created successfully.")
                } else {
                    toast.error(`${res.data.error.msg}`)
                }
            })
            .catch( err => {
                console.log(err)
                toast.error(`${err}`)
            })
            .finally(() => {
                toggleManager.reset('create-is-loading')
            })
    
        }
    

        const createClassInitialValues = {
            name: "",
            modeOfClass: "In-Person",
        }
        
        
        const createClassValidation = yup.object({
            name: yup.string().required("Please enter the name of the class").min(2).max(256),
            modeOfClass: yup.string().required("Please choose the class teaching mode").oneOf(["In-Person", "Online"])
        })

        return (
            <>
                <DialogContainer 
                toggleOpen={() => {toggleManager.toggle('create-dialog')}}
                isOpen={toggleManager.get('create-dialog')}
                title='Create a new class'
                description="Enter the class details below"
            >
                <Formik
                    initialValues={createClassInitialValues}
                    validationSchema={createClassValidation}
                    onSubmit={handleCreateClassSubmit}
                >
                    <Form className='flex flex-col gap-6'>
                        <Input name='name' label='Class Name' hasValidation />
                        <span className='w-full flex flex-col sm:flex-row gap-2'>
                            <SelectInput
                                className='w-full'
                                label='Mode Of Class'
                                hasValidation
                                options={[
                                    {
                                        label: "In Person",
                                        value: "In-Person"
                                    },
                                    {
                                        label: "Online",
                                        value: "Online"
                                    },
                                ]}
                                name='modeOfClass'
                                />
                        </span>
                        <span className='flex justify-end gap-4 w-full'>
                            <Button className='px-3 !h-[35px]' type='button' onClick={()=>{ toggleManager.toggle('create-dialog'); toggleManager.reset('create-is-loading')}} variant='neutral'>Close</Button>
                            <Button className='px-3 !h-[35px]' type='submit' isLoading={toggleManager.get('create-is-loading')}>Create Class</Button>
                        </span>
                    </Form>
                </Formik>
            </DialogContainer>
            </> 
        )
    }
    function AssignDialog(){
        
        const { entity: selectedAdmin, setSelected:setSelectedAdmin } = useSpecificEntity<IUserDoc | null>(); 
        const { administrators, isLoading: administratorsIsLoading } = useAdministrators(true, { role: "ADMIN"}, 100, 0)

        const filteredAdmins = administrators.filter(a => !a.classes?.map(c => `${c._id}`).includes(`${selectedClass?._id}`))


        function handleAssignClass(){

            if(!selectedClass) {
                toast.error("Kindly select a class")
                return
            }
    
            if(!selectedAdmin) {
                toast.error("Kindly select an admin")
                return
            }
    
    
            abstractAuthenticatedRequest(
                "get",
                `/api/v1/classes/assign-administrator?classId=${selectedClass._id}&adminId=${selectedAdmin._id}`,
                {},
                {},
                {
                    onStart: ()=>{toggleManager.toggle('assign-is-loading')},
                    onSuccess: (data) => {
                        toast.success("Admin assigned successfully");
                        manuallyToggleCompositeFilterFlag();
                        toggleManager.toggle('assign-dialog');
                    },
                    onFailure: (err) => {toast.error(`${err.msg}`)},
                    finally: () => {toggleManager.reset('assign-is-loading')}
                }
            )
        }

        return (
            <>
                <DialogContainer
                title='Assign Administrator'
                description={`Kindly select the administrator you want to assign to ${selectedClass?.name}`}
                isOpen={toggleManager.get('assign-dialog')}
                toggleOpen={()=>{ toggleManager.toggle('assign-dialog') }}
            >
                <div className='flex flex-col gap-2'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-48 overflow-y-auto">
                        {
                            administratorsIsLoading && 
                            <div className='col-span-1 sm:col-span-2 flex p-4 items-center justify-center'>
                                <span className='w-4 h-4 rounded-full border-[1.5px] border-t-blue-600 animate-spin'></span>
                            </div>
                        }
                        {
                            !administratorsIsLoading && filteredAdmins.length > 0 && filteredAdmins.map((admin, idx) => (<>
                                <div
                                    key={idx} onClick={()=>{
                                        // @ts-ignore
                                        setSelectedAdmin(admin)
                                    }}
                                className={`flex gap-2 items-center rounded p-2 hover:bg-blue-100/40 hover:border-blue-100 cursor-pointer duration-150 border-2 ${ 
                                    // @ts-ignore
                                    selectedAdmin == admin ? "border-blue-700/40" : "border-transparent"}`}  >
                                    <div className='rounded-full flex-shrink-0 aspect-square h-full bg-blue-100 text-blue-700 font-light grid place-items-center'>{admin.firstName[0]+admin.lastName[0]}</div>
                                    <div className='flex flex-col'>
                                        <p>{admin.firstName} {admin.lastName}</p>
                                        <small>{admin.email}</small>
                                    </div>
                                </div>
                            </>
                            ))
                        }
                        {
                            !administratorsIsLoading && filteredAdmins.length == 0 && 
                            <div className='w-full col-span-1 sm:col-span-2 my-4 text-blue-700 text-center'>No Administrators available</div>
                        }
                    </div>
                    <div className='flex w-full justify-end gap-4 mt-4'>
                        <Button className='!h-[35px] px-2' 
                            variant='neutral' 
                            onClick={()=> { 
                                toggleManager.reset('assign-dialog'); 
                                resetSelectedClass();
                            }}
                        >Close</Button>
                        <Button className='!h-[35px] px-2'  
                            isLoading={toggleManager.get('assign-is-loading')} 
                            onClick={handleAssignClass}
                        >Assign Administrator</Button>
                    </div>
                </div>
            </DialogContainer>
            </>
        )
    }
    function UpdateDialog(){

        const updateClassValidation = yup.object({
            name: yup.string().required("Please enter the name of the class").min(2).max(256),
            modeOfClass: yup.string().required("Please choose the class teaching mode").oneOf(["In-Person", "Online"])
        })

        function handleUpdateClassSubmit(values:{
            name: string | undefined,
            modeOfClass: string
        }){
            toggleManager.toggle('update-is-loading')
    
            const changedValues = {}
            
            Object.keys(values).map((field) => {
                // @ts-ignore
                if(values[field] !== selectedClass[field]){
                    //@ts-ignore
                    changedValues[field] = values[field]
                }
            })
    
            makeAuthenticatedRequest(
                "patch",
                `/api/v1/classes/${selectedClass?._id}`,
                {
                    ...changedValues,
                    authToken: _getToken()
                    
                }
            ).then( res => {
                if(res.status == 200 && res.data.success){
                    toast.success("Class Updated Successfully")
                    manuallyToggleCompositeFilterFlag()
                    toggleManager.toggle('update-dialog')
                } else {
                    toast.error(`${res.data.error.msg}`)
                }
            })
            .catch( err => {
                if(err.message){
                    toast.error(`${err.message}`)
                } else {
                    toast.error(`${err}`)
                }
            })
            .finally(() => {
                toggleManager.reset('update-is-loading')
            })
        }

        return (
            <>
                <DialogContainer 
                    toggleOpen={()=>{ toggleManager.toggle('update-dialog')}}
                    isOpen={toggleManager.get('update-dialog')}
                    title='Update A Class'
                    description={`Update the "${selectedClass?.name}" class details below`}
                >
                    <Formik
                        initialValues={updateClassInitialValues}
                        validationSchema={updateClassValidation}
                        onSubmit={handleUpdateClassSubmit}
                    >
                    <Form className='flex flex-col gap-6'>
                        <Input name='name' label='Class Name' hasValidation />
                        <span className='w-full flex flex-col sm:flex-row gap-2'>
                            <SelectInput
                                className='w-full'
                                label='Mode Of Class'
                                hasValidation
                                options={[
                                    {
                                        label: "In Person",
                                        value: "In-Person"
                                    },
                                    {
                                        label: "Online",
                                        value: "Online"
                                    },
                                ]}
                                name='modeOfClass'
                                />
                        </span>
                        <span className='flex justify-end gap-4 w-full'>
                            <Button className='px-3 !h-[35px]' 
                                type='button' 
                                variant='neutral'
                                isDisabled={toggleManager.get('update-is-loading')} 
                                onClick={()=>{toggleManager.reset('update-dialog')}} 
                            >Close</Button>
                            <Button className='px-3 !h-[35px]' 
                                type='submit' 
                                isLoading={toggleManager.get('update-is-loading')}
                            >Update Class</Button>
                        </span>
                    </Form>
                </Formik>
            </DialogContainer>
            </>
        )

    }
    function DeleteDialog(){

        function handleDeleteClass(){
            toggleManager.toggle('delete-is-loading')
            makeAuthenticatedRequest(
                "delete",
                `/api/v1/classes/${selectedClass?._id}`,
                {
                    authToken: _getToken()
                }
            ).then( res => {
                if(res.status == 200 && res.data.success){
                    manuallyToggleCompositeFilterFlag();
                    toggleManager.reset('delete-dialog');
                    toast.success("Class deleted successfully");
                } else {
                    toast.error(`${res.data.error.msg}`)
                }
            })
            .catch(err => {
                if(err.message){
                    toast.error(`${err.message}`)
                } else {
                    toast.error(`${err}`)
                }
            })
            .finally(() => {
                toggleManager.reset('delete-is-loading')
            })
        }


        return (
            <>
                <DialogContainer
                    title='Delete Class'
                    description={`Are you sure you want to delete ${selectedClass?.name}?`}
                    isOpen={toggleManager.get('delete-dialog')}
                    toggleOpen={() => {toggleManager.toggle('delete-dialog')}}
                >
                    <div className='flex w-full justify-end gap-4 mt-4'>
                        <Button className='!h-[35px] px-2' 
                            variant='neutral' 
                            isDisabled={toggleManager.get('delete-is-loading')} 
                            onClick={()=> { 
                                toggleManager.reset('delete-dialog'); 
                                setSelectedClass({}) 
                            }}
                        >Close</Button>
                        <Button className='!h-[35px] px-2' 
                            variant='danger' 
                            isLoading={toggleManager.get('delete-is-loading')} 
                            onClick={handleDeleteClass}
                        >Delete Class</Button>
                    </div>
                </DialogContainer>
            </>
        )

    }

    function RemoveAdminDialog(){
        
        const { entity: selectedAdmin, setSelected: setSelectedAdmin, resetSelected: resetSelectedAdmin } = useSpecificEntity<IUserDoc | null>(); 
        const { administrators, isLoading: administratorsIsLoading } = useAdministrators(true, { role: "ADMIN"}, 100, 0)
    
    
        function handleRemoveAdmin(){
    
            if(!selectedAdmin) {
                toast.error("Kindly select an admin")
                return
            }
    
    
            abstractAuthenticatedRequest(
                "patch",
                `/api/v1/classes/${selectedClass?.code}/remove-administrator/${selectedAdmin.code}?classIsId=false&adminIsId=false`,
                {},
                {},
                {
                    onStart: ()=>{toggleManager.toggle('remove-admin-is-loading')},
                    onSuccess: (data) => {
                        toast.success("Admin unassigned successfully");
                        manuallyToggleCompositeFilterFlag();
                        toggleManager.toggle('remove-admin-dialog');
                    },
                    onFailure: (err) => {toast.error(`${err.msg}`)},
                    finally: () => {toggleManager.reset('remove-admin-is-loading')}
                }
            )
        }
    
        const filteredAdmins = administrators.filter(a => a.classes?.map(c => `${c._id}`).includes(`${selectedClass?._id}`))
    
        return (
            <>
                <DialogContainer
                title='Unassign Administrator'
                description={`Kindly select the admin you want to remove from class ${selectedClass?.name}`}
                isOpen={toggleManager.get('remove-admin-dialog')}
                toggleOpen={()=>{ toggleManager.toggle('remove-admin-dialog') }}
            >
                <div className='flex flex-col gap-2'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-48 overflow-y-auto">
                        {
                            administratorsIsLoading && 
                            <div className='col-span-1 sm:col-span-2 flex p-4 items-center justify-center'>
                                <span className='w-4 h-4 rounded-full border-[1.5px] border-t-blue-600 animate-spin'></span>
                            </div>
                        }
                        {
                            !administratorsIsLoading && filteredAdmins.map((admin, idx) => (
                                <div
                                    key={idx} onClick={()=>{
                                        // @ts-ignore
                                        setSelectedAdmin(admin)
                                    }}
                                className={`flex gap-2 items-center rounded p-2 hover:bg-blue-100/40 hover:border-blue-100 cursor-pointer duration-150 border-2 ${ 
                                    // @ts-ignore
                                    selectedAdmin == admin ? "border-blue-700/40" : "border-transparent"}`}  >
                                    <div className='rounded-full flex-shrink-0 aspect-square h-full bg-blue-100 text-blue-700 font-light grid place-items-center'>{admin.firstName[0]+admin.lastName[0]}</div>
                                    <div className='flex flex-col'>
                                        <p>{admin.firstName} {admin.lastName}</p>
                                        <small>{admin.email}</small>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            !administratorsIsLoading && filteredAdmins.length == 0 && 
                            <div className='w-full col-span-1 sm:col-span-2 my-4 text-blue-700 text-center'>No Assigned Administrators</div>
                        }
                    </div>
                    <div className='flex w-full justify-end gap-4 mt-4'>
                        <Button className='!h-[35px] px-2' 
                            variant='neutral' 
                            onClick={()=> { 
                                toggleManager.reset('remove-admin-dialog'); 
                                resetSelectedAdmin()
                            }}
                            isDisabled={toggleManager.get('remove-admin-is-loading')}
                        >Close</Button>
                        <Button className='!h-[35px] px-2'  
                            isLoading={toggleManager.get('remove-admin-is-loading')} 
                            onClick={handleRemoveAdmin}
                        >Remove Admin</Button>
                    </div>
                </div>
            </DialogContainer>
            </>
        )
      }

    return (
        <>
            { toggleManager.get('create-dialog') && user?.role == "SUDO" && <CreateDialog />}
            { toggleManager.get('assign-dialog') && user?.role == "SUDO" && <AssignDialog />}
            { toggleManager.get('update-dialog') && user?.role == "SUDO" && <UpdateDialog />}
            { toggleManager.get('delete-dialog') && user?.role == "SUDO" && <DeleteDialog />}
            { toggleManager.get('remove-admin-dialog') && user?.role == "SUDO" && <RemoveAdminDialog />}

            <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full'>
                <div className='mt-2 flex flex-col sm:flex-row h-fit sm:justify-between gap-2 sm:items-center'>
                    <h3 className='text-blue-800'>Classes</h3>
                    <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                        <div className='flex flex-wrap gap-2 sm:gap-4'>
                            <div>
                                <Button
                                    onClick={() => { toggleManager.toggle('filter-is-shown') }}
                                    variant='outline'
                                    className='!h-[35px] px-2 flex items-center gap-2'
                                >
                                    <FunnelIcon className='w-4' />
                                    { toggleManager.get('filter-is-shown') ? "Close" : "Show"} Filters    
                                </Button>
                            </div>
                            { 
                                toggleManager.get('filter-is-shown') && 
                                <>
                                    {/* <div className='flex flex-row items-center gap-2 '>
                                        <small className='text-blue-700'>Status</small>
                                        <select
                                            className='text-base text-blue-600 border-[1.5px] focus:outline-blue-300 focus:ring-0  rounded-md border-slate-300 shadow-sm h-[35px] px-2'
                                            onChange={(e) => { 
                                                // @ts-ignore
                                                StatusChangeFilter(e.target.value)
                                            }}
                                        >
                                            { 
                                                StatusFilterOptions.map((f, idx) =>{ 
                                                    return (
                                                        <option key={idx} value={f}>{f}</option>
                                                    )
                                                })
                                            }
                                        </select> 
                                    </div> */}
                                    <div className='flex flex-row items-center gap-2 '>
                                        <small className='text-blue-700'>Mode of Class</small>
                                        <select
                                            className='text-base text-blue-600 border-[1.5px] focus:outline-blue-300 focus:ring-0  rounded-md border-slate-300 shadow-sm h-[35px] px-2'
                                            onChange={(e) => { 
                                                // @ts-ignore
                                                ModeOfClassChangeFilter(e.target.value)
                                            }}
                                        >
                                            { 
                                                ModeOfClassFilterOptions.map((f, idx) =>{ 
                                                    return (
                                                        <option key={idx} value={f}>{f}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    { 
                                    user!.role == "SUDO" && 
                                    <div className='flex flex-row items-center gap-2 '>
                                        <small className='text-blue-700'>Assigned Status</small> 
                                        <select
                                            className='text-base text-blue-600 border-[1.5px] focus:outline-blue-300 focus:ring-0  rounded-md border-slate-300 shadow-sm h-[35px] px-2'
                                            onChange={(e) => { 
                                                // @ts-ignore
                                                AssignedStatusChangeFilter(e.target.value)
                                            }}
                                        >
                                            { 
                                                AssignedStatusFilterOptions.map((f, idx) =>{ 
                                                    return (
                                                        <option key={idx} value={f}>{f}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    }
                                </>
                            }
                            <div>
                                <Button className='!h-[35px] px-2' variant='outline' onClick={manuallyToggleCompositeFilterFlag}> <ArrowPathIcon className='w-4' /> </Button>
                            </div>
                        </div>
                        {  user!.role == "SUDO" && 
                            <Button className='flex w-fit' onClick={()=>{toggleManager.toggle('create-dialog')}}> <PlusIcon className='inline w-4 mr-1' />Add a class</Button>
                        }
                    </div>
                </div>
                <div className='w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow'>
                    <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
                        <div className = 'w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                                <div className='flex items-center gap-4'>
                                    <span className='flex-1 font-normal truncate'>NAME</span>
                                </div>
                                <div className='flex gap-4 items-center font-light'>
                                  <span className='w-[100px]  hidden sm:flex justify-end'>MODE</span>
                                  { user!.role == "SUDO" && <span className='w-[120px] hidden sm:flex justify-end'>NO. OF ADMINS</span> }
                                  <span className='w-[150px] hidden sm:flex justify-end'>DATE CREATED</span>
                                  
                                  { user!.role == "SUDO"  && <span className='w-[140px] flex justify-end'>ACTIONS</span> }
                                </div>
                            </div>
                        {
                            classesIsLoading && 
                             <div className='w-full h-full m-auto'>
                                <div
                                    className='w-5 aspect-square m-auto mt-4 rounded-full border-[1px] border-t-blue-500 animate-spin' 
                                ></div>
                            </div>
                        } 
                        { 
                        !classesIsLoading && classes && classes.length != 0 && classes.map((tClass, idx) => {
                            return (
                            // Onclick trigger a dialog
                            <Link 
                              to={`/classes/${tClass.code}`}
                              key={idx} 
                              className = 'w-full text-blue-700 cursor-pointer py-2 px-1 sm:px-3 bg-white border-blue-700/40 border-b-[0.5px] flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'
                            >
                                <div className='flex items-center gap-4 truncate'>
                                    <span className='flex-1 font-normal truncate'>{tClass.name}</span>
                                </div>
                                <div className='flex gap-4 items-center font-light'>
                                  <span className='hidden w-[100px] sm:flex justify-end'>{tClass.modeOfClass}</span>
                                  { user!.role == "SUDO" && <span className='w-[120px] hidden sm:flex justify-end'>{tClass.administrators.length} Admin(s)</span> }
                                  <span className='w-[150px] hidden sm:flex justify-end'>{dayjs(tClass.createdAt).format("HH:mm - DD/MM/YYYY")}</span>
                                  { 
                                        user!.role == "SUDO" && 
                                            <div className='w-[140px] flex justify-end gap-2'>
                                                <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={(e)=>{ e.preventDefault(); setSelectedClass(tClass), toggleManager.toggle('assign-dialog')}}>              
                                                    <UserPlusIcon className='w-4 h-4' />
                                                </span>
                                                <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={(e)=>{ e.preventDefault(); setSelectedClass(tClass), toggleManager.toggle('update-dialog')}}>              
                                                    <PencilIcon className='w-4 h-4' />
                                                </span>
                                                <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={(e)=>{ e.preventDefault(); setSelectedClass(tClass), toggleManager.toggle('remove-admin-dialog')}}>              
                                                    <UserMinusIcon className='w-4 h-4' />
                                                </span>
                                                <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={(e) => { e.preventDefault(); setSelectedClass(tClass); toggleManager.toggle('delete-dialog') }}>
                                                    <TrashIcon className='w-4 h-4' />
                                                </span>
                                            </div> 
                                    }
                                  </div>
                            </Link>
                            )
                        })
                        }
                    </div>
                </div>
                <div className='flex justify-end text-blue-700 mt-2 pb-2'>
                    <p>Showing <span className='font-semibold'>{classes?.length ?? 0}</span> of <span className='font-semibold'>{classesCount}</span></p>
                </div>
            </div>
        </>
    )

}
