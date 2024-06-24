import { Button, DialogContainer, Input } from '@repo/ui';
import { createLazyFileRoute } from '@tanstack/react-router';
import { PlusIcon, ArrowPathIcon, FunnelIcon } from '@heroicons/react/24/outline'
import * as yup from 'yup'
import { _getToken, makeAuthenticatedRequest, useDialog, useLoading } from '@repo/utils';
import { Formik, Form } from 'formik'
import { SelectInput } from '@repo/ui';
import { toast } from 'sonner'
import { useClasses, useCompositeFilterFlag } from '../hooks';
import { useClassesAssignedStatusFilter, useClassesModeOfClassFilter, useClassesStatusFilter } from '../hooks/classes.hook';

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


    const { isLoading, toggleLoading, resetLoading } = useLoading()

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
            <div className='flex flex-col w-full h-full'>
                <div className='mt-2 flex h-fit justify-between items-center'>
                    <h2 className='text-blue-800'>Classes</h2>
                    <Button className='flex px-2 !h-[35px]' onClick={toggleDialog}> <PlusIcon className='inline w-4 mr-1' /> Add a class</Button>
                </div>
                <div className='w-full mt-3 flex gap-3'>
                    <div  className='flex flex-col gap-2 justify-end mt-6'>
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
                            <div className='flex flex-col gap-2 '>
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
                            <div className='flex flex-col gap-2 '>
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
                            <div className='flex flex-col gap-2 '>
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
                    <div className='flex flex-col gap-2 justify-end'>
                        <Button className='!h-[35px] px-2' variant='outline' onClick={manuallyToggleCompositeFilterFlag}> <ArrowPathIcon className='w-4' /> </Button>
                    </div>
                </div>
                <div className='w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow-sm'>
                    <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
                        <div className = 'w-full text-blue-700 py-2 px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                                <div className='flex items-center gap-4'>
                                    <span className=' w-[70px]'>CODE</span>
                                    <span className='flex-1 font-normal truncate'>NAME</span>
                                </div>
                                <div className='flex gap-4 items-center font-light'>
                                  <span className='w-[150px]  flex justify-end'>MODE OF CLASS</span>
                                  <span className='w-[200px] flex justify-end'>NO. OF ADMINISTRATORS</span>
                                  <span className='w-[100px] flex justify-end'>LAST UPDATED</span>
                                  <span className='w-[150px]'></span>
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
                        !classesIsLoading && classes.map(({ code, name, modeOfClass, updatedAt, administrators }, idx) => {
                            return (
                            // Onclick trigger a dialog
                            <div key={idx} className = 'w-full text-blue-700 cursor-pointer py-2 px-3 bg-white border-blue-700/40 border-b-[0.5px] flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'>
                                <div className='flex items-center gap-4'>
                                    <small className='font-light w-[70px]'>{code}</small>
                                    <h5 className='flex-1 font-normal truncate'>{name}</h5>
                                </div>
                                <div className='flex gap-4 items-center font-light'>
                                  <span className='w-[150px] flex justify-end'>{modeOfClass}</span>
                                  <span className='w-[200px] flex justify-end'>{administrators.length} Administrators</span>
                                  <span className='w-[100px] flex justify-end'>{new Date(updatedAt).toLocaleTimeString()}</span>
                                  <span className='w-[150px] flex justify-end'>{new Date(updatedAt).toDateString()}</span>
                                </div>
                            </div>
                            )
                        })
                        }
                    </div>
                </div>
                <div className='flex justify-end text-blue-700 mt-2'>
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