import { Button, DialogContainer, Input } from '@repo/ui';
import { createLazyFileRoute, Link, useRouterState, Outlet } from '@tanstack/react-router';
import { PlusIcon, ArrowPathIcon, FunnelIcon, TrashIcon, EyeIcon, PencilIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import * as yup from 'yup'
import { _getToken, abstractAuthenticatedRequest, makeAuthenticatedRequest, useDialog, useLoading } from '@repo/utils';
import { Formik, Form } from 'formik'
import { SelectInput } from '@repo/ui';
import { toast } from 'sonner'
import { useAdministrators, useClasses, useCompositeFilterFlag } from '../hooks';
import { useClassesAssignedStatusFilter, useClassesModeOfClassFilter, useClassesStatusFilter } from '../hooks/classes.hook';
import { IClassDoc } from '@repo/models';
import { useState } from 'react';
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
    const { filter: StatusFilter, filterOptions: StatusFilterOptions, changeFilter: StatusChangeFilter, filterChangedFlag: StatusFilterChangedFlag } = useClassesStatusFilter();
    
    const { dialogIsOpen: filterIsShown, toggleDialog: toggleFiltersAreShown } = useDialog();
    
    const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ AssignedStatusFilterChangedFlag, StatusFilterChangedFlag, ModeOfClassFilterChangedFlag])

    const { isLoading: classesIsLoading, classes, count: classesCount } = useClasses(compositeFilterFlag, {
      ...AssignedStatusFilter,
      ...ModeOfClassFilter,
      ...StatusFilter,
        user,
    });

    const { dialogIsOpen, toggleDialog } = useDialog();
    const { dialogIsOpen: updateDialogIsOpen, toggleDialog: toggleUpdateDialog } = useDialog();
    const { dialogIsOpen: deleteDialogIsOpen, toggleDialog: toggleDeleteDialog } = useDialog();
    const { dialogIsOpen: assignDialogIsOpen, toggleDialog: toggleAssignDialog } = useDialog();

    const { isLoading: deleteIsLoading, toggleLoading: toggleDeleteIsLoading } = useLoading()
    const { isLoading, toggleLoading, resetLoading } = useLoading()
    const { isLoading: updateIsLoading, toggleLoading: toggleUpdateIsLoading, resetLoading:resetUpdateIsLoading } = useLoading()
    const { isLoading: assignIsLoading, toggleLoading: toggleAssignIsLoading, resetLoading:resetAssignIsLoading } = useLoading()
    
    const [ selectedClass, setSelectedClass ] = useState<Partial<IClassDoc>>({
        name: '',
        modeOfClass: 'Active'
    })
    
    
    const updateClassInitialValues = {
        name: selectedClass.name!,
        modeOfClass: selectedClass.modeOfClass!,
    }

    function handleCreateClassSubmit(values:{
        name: string,
        modeOfClass: string
    }){
        toggleLoading()
        
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
                toggleDialog()
                toggleLoading()
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

    }

    function handleUpdateClassSubmit(values:{
        name: string | undefined,
        modeOfClass: string
    }){
        toggleUpdateIsLoading()

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
            `/api/v1/classes/${selectedClass._id}`,
            {
                ...changedValues,
                authToken: _getToken()
                
            }
        ).then( res => {
            if(res.status == 200 && res.data.success){
                toast.success("Class Updated Successfully")
                manuallyToggleCompositeFilterFlag()
            } else {
                toast.error(`${res.data.error.msg}`)
            }
            toggleUpdateDialog()
            resetUpdateIsLoading()
        })
        .catch( err => {
            if(err.message){
                toast.error(`${err.message}`)
            } else {
                toast.error(`${err}`)
            }
            resetUpdateIsLoading()
        })
    }

    function handleDeleteClass(){
        toggleDeleteIsLoading()
        makeAuthenticatedRequest(
            "delete",
            `/api/v1/classes/${selectedClass._id}`,
            {
                authToken: _getToken()
            }
        ).then( res => {
            if(res.status == 200 && res.data.success){
                manuallyToggleCompositeFilterFlag();
                toast.success("Class deleted successfully")                
            } else {
                toast.error(`${res.data.err.msg}`)
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
            toggleDeleteIsLoading();
            toggleDeleteDialog()
        })
    }

    function CreateDialog(){

        return (
            <>
                <DialogContainer 
                toggleOpen={toggleDialog}
                isOpen={dialogIsOpen}
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
                            <Button className='px-3 !h-[35px]' type='button' onClick={()=>{ toggleDialog(); resetLoading()}} variant='neutral'>Close</Button>
                            <Button className='px-3 !h-[35px]' type='submit' isLoading={isLoading}>Create Class</Button>
                        </span>
                    </Form>
                </Formik>
            </DialogContainer>
            </> 
        )
    }
    function AssignDialog(){
        
        const [selectedAdmin, setSelectedAdmin ] = useState<IUserDoc | null>(null); 
        const { administrators, isLoading: administratorsIsLoading } = useAdministrators(true, { role: "ADMIN"}, 100, 0);
   
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
                    onStart: ()=>{toggleAssignIsLoading},
                    onSuccess: (data) => {
                        toast.success("Admin assigned successfully");
                        manuallyToggleCompositeFilterFlag();
                        toggleAssignDialog();
                    },
                    onFailure: (err) => {toast.error(`${err.msg}`)},
                    finally: () => {resetAssignIsLoading}
                }
            )
        }

        return (
            <>
                <DialogContainer
                title='Assign Administrator'
                description={`Kindly select the administrator you want to assign to ${selectedClass.name}`}
                isOpen={assignDialogIsOpen}
                toggleOpen={toggleAssignDialog}
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
                            !administratorsIsLoading && administrators.map((admin, idx) => (<>
                                <div className={`flex gap-2 items-center rounded p-2 hover:bg-blue-100/40 hover:border-blue-100 cursor-pointer duration-150 border-2 ${ selectedAdmin == admin ? "border-blue-700/40" : "border-transparent"}`} key={idx} onClick={()=>{setSelectedAdmin(admin)}}>
                                    <div className='rounded-full flex-shrink-0 aspect-square h-full bg-blue-100 text-blue-700 font-light grid place-items-center'>{admin.firstName[0]+admin.lastName[0]}</div>
                                    <div className='flex flex-col'>
                                        <p>{admin.firstName} {admin.lastName}</p>
                                        <small>{admin.email}</small>
                                    </div>
                                </div>
                            </>
                            ))
                        }
                    </div>
                    <div className='flex w-full justify-end gap-4 mt-4'>
                        <Button className='!h-[35px] px-2' variant='neutral' isLoading={assignIsLoading} onClick={()=> { toggleAssignDialog(); setSelectedAdmin(null); setSelectedClass({}) }}>Close</Button>
                        <Button className='!h-[35px] px-2'  isLoading={assignIsLoading} onClick={handleAssignClass}>Assign Administrator</Button>
                    </div>
                </div>
            </DialogContainer>
            </>
        )
    }
    function UpdateDialog(){

        return (
            <>
                 <DialogContainer 
                toggleOpen={toggleUpdateDialog}
                isOpen={updateDialogIsOpen}
                title='Update A Class'
                description={`Update the "${selectedClass.name}" class details below`}
            >
                <Formik
                    initialValues={updateClassInitialValues}
                    validationSchema={createClassValidation}
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
                            <Button className='px-3 !h-[35px]' type='button' onClick={()=>{ toggleUpdateDialog(); resetUpdateIsLoading()}} variant='neutral'>Close</Button>
                            <Button className='px-3 !h-[35px]' type='submit' isLoading={updateIsLoading}>Update Class</Button>
                        </span>
                    </Form>
                </Formik>
            </DialogContainer>
            </>
        )

    }

    function DeleteDialog(){

        return (
            <>
                <DialogContainer
                    title='Delete Class'
                    description={`Are you sure you want to delete ${selectedClass.name}?`}
                    isOpen={deleteDialogIsOpen}
                    toggleOpen={toggleDeleteDialog}
                >
                    <div className='flex w-full justify-end gap-4 mt-4'>
                        <Button className='!h-[35px] px-2' variant='neutral' isLoading={deleteIsLoading} onClick={()=> { toggleDeleteDialog(); setSelectedClass({}) }}>Close</Button>
                        <Button className='!h-[35px] px-2' variant='danger' isLoading={deleteIsLoading} onClick={() => { handleDeleteClass }}>Delete Class</Button>
                    </div>
                </DialogContainer>
            </>
        )

    }

    return (
        <>
            <CreateDialog />
            <AssignDialog />
            <UpdateDialog />
            <DeleteDialog />

            <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full'>
                <div className='mt-2 flex h-fit justify-between items-center'>
                    <h2 className='text-blue-800'>Classes</h2>
                    {  user!.role == "SUDO" && 
                        <Button className='flex px-2 !h-[35px]' onClick={toggleDialog}> <PlusIcon className='inline w-4 mr-1' /> Add a class</Button>
                    }
                </div>
                <div className='w-full flex flex-wrap gap-3 mt-3'>
                    <div  className=''>
                        <Button
                            onClick={toggleFiltersAreShown}
                            variant='outline'
                            className='!h-[35px] px-2 flex items-center gap-2'
                        >
                            <FunnelIcon className='w-4' />
                            { filterIsShown ? "Close" : "Show"} Filters    
                        </Button>
                    </div>
                    { 
                        filterIsShown && 
                        <>
                            <div className='flex flex-row items-center gap-2 '>
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
                            </div>
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
                <div className='w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow'>
                    <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
                        <div className = 'w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                                <div className='flex items-center gap-4'>
                                    <span className='flex-1 font-normal truncate'>NAME</span>
                                </div>
                                <div className='flex gap-4 items-center font-light'>
                                  <span className='w-[100px]  hidden sm:flex justify-end'>MODE</span>
                                  { user!.role == "SUDO" && <span className='w-[120px] hidden sm:flex justify-end'>NO. OF ADMINS</span> }
                                  <span className='w-[100px] hidden sm:flex justify-end'>LAST UPDATED</span>
                                  
                                  <span className='w-[120px] flex justify-end'>ACTIONS</span>
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
                        !classesIsLoading && classes.length != 0 && classes.map((tClass, idx) => {
                            return (
                            // Onclick trigger a dialog
                            <div 
                                key={idx} 
                                className = 'w-full text-blue-700 cursor-pointer py-2 px-1 sm:px-3 bg-white border-blue-700/40 border-b-[0.5px] flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'
                                >
                                <div className='flex items-center gap-4'>
                                    <h5 className='flex-1 font-normal truncate'>{tClass.name}</h5>
                                </div>
                                <div className='flex gap-4 items-center font-light'>
                                  <span className='hidden w-[100px] sm:flex justify-end'>{tClass.modeOfClass}</span>
                                  { user!.role == "SUDO" && <span className='w-[120px] hidden sm:flex justify-end'>{tClass.administrators.length} Admin(s)</span> }
                                  <span className='w-[100px] hidden sm:flex justify-end'>{dayjs(tClass.updatedAt).format("DD/MM/YY")}</span>
                                  <div className='w-[120px] flex justify-end gap-2'>
                                        <Link to={`/classes/${tClass.code}`}  className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' >
                                            <EyeIcon className='w-4 h-4' />
                                        </Link>
                                        { 
                                            user!.role == "SUDO" && 
                                            <> 
                                                <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={()=>{ setSelectedClass(tClass), toggleAssignDialog()}}>              
                                                    <UserPlusIcon className='w-4 h-4' />
                                                </span>
                                                <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={()=>{ setSelectedClass(tClass), toggleUpdateDialog()}}>              
                                                    <PencilIcon className='w-4 h-4' />
                                                </span>
                                                <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={() => { setSelectedClass(tClass); toggleDeleteDialog() }}>
                                                    <TrashIcon className='w-4 h-4' />
                                                </span>
                                            </> 
                                        }
                                  </div>
                            
                                </div>

                            </div>
                            )
                        })
                        }
                    </div>
                </div>
                <div className='flex justify-end text-blue-700 mt-2 pb-2'>
                    <p>Showing <span className='font-semibold'>{classes.length}</span> of <span className='font-semibold'>{classesCount}</span></p>
                </div>
            </div>
        </>
    )

}


const createClassInitialValues = {
    name: "",
    modeOfClass: "In-Person",
}


const createClassValidation = yup.object({
    name: yup.string().required("Please enter the name of the class").min(2).max(256),
    modeOfClass: yup.string().required("Please choose the class teaching mode").oneOf(["In-Person", "Online"])
})