import { Button, DialogContainer, Input } from '@repo/ui';
import { createLazyFileRoute } from '@tanstack/react-router';
import { PlusIcon, ArrowPathIcon, FunnelIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import * as yup from 'yup'
import { _getToken, makeAuthenticatedRequest, useDialog, useLoading } from '@repo/utils';
import { Formik, Form } from 'formik'
import { SelectInput } from '@repo/ui';
import { toast } from 'sonner'
import { useClasses, useCompositeFilterFlag } from '../hooks';
import { useClassesAssignedStatusFilter, useClassesModeOfClassFilter, useClassesStatusFilter } from '../hooks/classes.hook';
import { IClassDoc } from '@repo/models';
import { useState } from 'react';

export const Route = createLazyFileRoute('/classes')({
    component: Classes
})


function Classes(){

    const { filter: AssignedStatusFilter, filterOptions: AssignedStatusFilterOptions, changeFilter: AssignedStatusChangeFilter, filterChangedFlag: AssignedStatusFilterChangedFlag } = useClassesAssignedStatusFilter();
    const { filter: ModeOfClassFilter, filterOptions: ModeOfClassFilterOptions, changeFilter: ModeOfClassChangeFilter, filterChangedFlag: ModeOfClassFilterChangedFlag } = useClassesModeOfClassFilter();
    const { filter: StatusFilter, filterOptions: StatusFilterOptions, changeFilter: StatusChangeFilter, filterChangedFlag: StatusFilterChangedFlag } = useClassesStatusFilter();
    
    const { dialogIsOpen: filterIsShown, toggleDialog: toggleFiltersAreShown } = useDialog();
    
    const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ AssignedStatusFilterChangedFlag, StatusFilterChangedFlag, ModeOfClassFilterChangedFlag])

    const { isLoading: classesIsLoading, classes, count: classesCount } = useClasses(compositeFilterFlag, {
      ...AssignedStatusFilter,
      ...ModeOfClassFilter,
      ...StatusFilter,
    });

    const { dialogIsOpen, toggleDialog } = useDialog();
    const { dialogIsOpen: updateDialogIsOpen, toggleDialog: toggleUpdateDialog } = useDialog();
    const { dialogIsOpen: deleteDialogIsOpen, toggleDialog: toggleDeleteDialog } = useDialog();

    const { isLoading: deleteIsLoading, toggleLoading: toggleDeleteIsLoading } = useLoading()
    const { isLoading, toggleLoading, resetLoading } = useLoading()
    const { isLoading: updateIsLoading, toggleLoading: toggleUpdateIsLoading, resetLoading:resetUpdateIsLoading } = useLoading()
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
                toast.success(<p>Class created successfully.</p>)
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
                toast.success("Administrator Updated Successfully")
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
            <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full'>
                <div className='mt-2 flex h-fit justify-between items-center'>
                    <h2 className='text-blue-800'>Classes</h2>
                    <Button className='flex px-2 !h-[35px]' onClick={toggleDialog}> <PlusIcon className='inline w-4 mr-1' /> Add a class</Button>
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
                        </>
                    }
                    <div>
                        <Button className='!h-[35px] px-2' variant='outline' onClick={manuallyToggleCompositeFilterFlag}> <ArrowPathIcon className='w-4' /> </Button>
                    </div>
                </div>
                <div className='w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow'>
                    <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
                        <div className = 'w-full text-blue-700 py-2 px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                                <div className='flex items-center gap-4'>
                                    <span className=' w-[70px]'>CODE</span>
                                    <span className='flex-1 font-normal truncate'>NAME</span>
                                </div>
                                <div className='flex gap-4 items-center font-light'>
                                  <span className='w-[150px]  hidden sm:flex justify-end'>MODE OF CLASS</span>
                                  <span className='w-[200px] hidden sm:flex justify-end'>NO. OF ADMINISTRATORS</span>
                                  <span className='w-[150px] hidden sm:flex justify-end'>LAST UPDATED</span>
                                  
                                  <span className='w-[100px] flex justify-end'>ACTIONS</span>
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
                        !classesIsLoading && classes.map((tClass, idx) => {
                            return (
                            // Onclick trigger a dialog
                            <div 
                                key={idx} 
                                className = 'w-full text-blue-700 cursor-pointer py-2 px-3 bg-white border-blue-700/40 border-b-[0.5px] flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'
                                >
                                <div className='flex items-center gap-4'>
                                    <small className='font-light w-[70px]'>{tClass.code}</small>
                                    <h5 className='flex-1 font-normal truncate'>{tClass.name}</h5>
                                </div>
                                <div className='flex gap-4 items-center font-light'>
                                  <span className='w-[150px] flex justify-end'>{tClass.modeOfClass}</span>
                                  <span className='w-[200px] flex justify-end'>{tClass.administrators.length} Administrators</span>
                                  <span className='w-[150px] flex justify-end'>{new Date(tClass.updatedAt).toDateString()}</span>
                                  <div className='w-[100px] flex justify-end gap-4'>
                                        <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={()=>{ setSelectedClass(tClass), toggleUpdateDialog()}}>              
                                            <PencilIcon className='w-4 h-4' />
                                        </span>
                                        <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={() => { setSelectedClass(tClass); toggleDeleteDialog() }}>
                                            <TrashIcon className='w-4 h-4' />
                                        </span>
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