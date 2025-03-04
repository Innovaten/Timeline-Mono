import { Button, DialogContainer, Input, SelectInput } from '@repo/ui';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useAdministrators, useAdministratorsFilter, useCompositeFilterFlag } from '../hooks';
import { PlusIcon, FunnelIcon, ArrowPathIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import * as yup from 'yup'
import { _getToken, makeAuthenticatedRequest, useDialog, useLoading, useToggleManager, validPhoneNumber } from '@repo/utils';
import { Formik, Form } from 'formik'
import { toast } from 'sonner'
import { useState } from 'react';
import { IUserDoc } from '@repo/models';
import dayjs from 'dayjs';
import { IClassDoc } from '@repo/models';

export const Route = createLazyFileRoute('/administrators')({
    component: Administrators
})


function Administrators(){
    
    const initialToggles = {
        'view-dialog': false,
        'create-dialog': false,
        'update-dialog': false,
        'delete-dialog': false,

        'refresh': false,
        'filters-is-shown': false,

        'create-is-loading': false,
        'update-is-loading': false,
        'delete-is-loading': false,
    }

    type TogglesType = typeof initialToggles
    type ToggleKeys = keyof TogglesType
    const toggleManager = useToggleManager<ToggleKeys>(initialToggles);

    const { filter, filterOptions, changeFilter, filterChangedFlag } = useAdministratorsFilter();
    const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ filterChangedFlag, toggleManager.get('refresh') ])
    
    const { isLoading: administratorsIsLoading, administrators, count: administratorsCount } = useAdministrators(compositeFilterFlag, filter);

    const [ selectedAdmin, setSelectedAdmin ] = useState<(Omit<Partial<IUserDoc>, "classes" > & { classes?: IClassDoc[] } )>({
        firstName: '',
        otherNames: '',
        lastName: '',
        gender: 'Male',
        email: '',
        phone: '',
        classes: [],
    });

    const updateAdminInitialValues = {
        firstName: selectedAdmin.firstName ?? "",
        otherNames: selectedAdmin.otherNames ?? "",
        lastName: selectedAdmin.lastName ?? "",
       
        email: selectedAdmin.email ?? "",
        phone: "0" + selectedAdmin.phone?.substring(3) ?? "",
       
        gender: selectedAdmin.gender ?? "Male"
    }

    function handleUpdateAdminSubmit(values:{
        firstName: string,
        otherNames: string,
        lastName: string,
        email: string,
        gender: string,
        phone: string,
    }){
        toggleManager.toggle('update-is-loading')
        values.phone = validPhoneNumber(values.phone)
        
        const changedValues = {}
        
        Object.keys(values).map((field) => {
            // @ts-ignore
            if(values[field] !== selectedAdmin[field]){
                //@ts-ignore
                changedValues[field] = values[field]
            }
        })

        makeAuthenticatedRequest(
            "patch",
            `/api/v1/users/${selectedAdmin._id}`,
            {
                ...changedValues,
                authToken: _getToken()
            }
        ).then( res => {
            if(res.status == 200 && res.data.success){
                toast.success("Administrator Updated Successfully")
                toggleManager.toggle('refresh')
            } else {
                values.phone = "0" + selectedAdmin.phone?.substring(3)
                toast.error(`${res.data.error.msg ? res.data.error.msg : res.data.error }`)
            }
            toggleManager.toggle('update-dialog')
        })
        .catch( err => {
            values.phone = "0" + selectedAdmin.phone?.substring(3)
            toast.error(`${err}`)
        })
        .finally(() => {
            toggleManager.reset('update-is-loading')
        })
    }
    
    function handleToggleRole(){

        toggleManager.toggle('update-is-loading')
        const baseUrl = "/api/v1/users/"
        const finalUrl = baseUrl +  (selectedAdmin.role == "SUDO" ? 'downgrade-to-admin?sudoId=' : "upgrade-to-sudo?adminId=" ) + selectedAdmin._id;
        
        makeAuthenticatedRequest(
            "get",
            finalUrl,
        )
        .then( res => {
            if(res.status == 200 && res.data.success){
                const successText = selectedAdmin.role == "SUDO" ? "User downgraded to Administrator successfully": "User upgraded to Sudo successfully";
                toast.success(successText);
                toggleManager.toggle('refresh')
                toggleManager.reset('update-dialog')
            } else {
                toast.error(`${res.data.error.msg ? res.data.error.msg : res.data.error}`)
            }
        })
        .catch(err => {
            toast.error(`${err}`)
        })
        .finally(() => {
            toggleManager.reset('update-is-loading');
        })
    }

    function handleCreateAdminSubmit(values:{
        firstName: string,
        otherNames: string,
        lastName: string,
        gender: string,
        email: string,
        phone: string,
        role: string,
    }){
        toggleManager.toggle('create-is-loading')

        const validPhone = validPhoneNumber(values.phone)

        makeAuthenticatedRequest(
            "post",
            "/api/v1/users",
            {
                ...values,
                phone: validPhone,
                authToken: _getToken(),
            },
        )
        .then(res => {

            if(res.status == 201 && res.data.success){
                toggleManager.toggle('create-dialog')
                toast.success(<p>Admin created successfully.<br/>A confirmation will be sent via email.</p>)
                toggleManager.toggle('refresh')
            } else {
                toast.error(`${res.data.error.msg ? res.data.error.msg : res.data.error}`)
            }
        })
        .catch( err => {
            console.log(err)
            toast.error(`${err}`)
        })
        .finally(() => {
            toggleManager.toggle('create-is-loading')
        })

    }

    function handleDeleteAdmin(){
        toggleManager.toggle('delete-is-loading');
        makeAuthenticatedRequest(
            "delete",
            `/api/v1/users/${selectedAdmin._id}`,
            {
                authToken: _getToken()
            }
        ).then( res => {
            if(res.status == 200 && res.data.success){
                toast.success("Administrator deleted successfully")
                toggleManager.toggle('refresh')          
                toggleManager.reset('delete-dialog')    
            } else {
                toast.error(`${res.data.error.msg ? res.data.error.msg : res.data.error}`)
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
            toggleManager.toggle('delete-is-loading');
        })
    }

    return (
        <>
            <DialogContainer 
                toggleOpen={() => toggleManager.toggle('create-dialog')}
                isOpen={toggleManager.get('create-dialog')}
                title='Add a new administrator'
                description="Enter the administrator's details below"
            >
                <Formik
                    initialValues={createAdminInitialValues}
                    validationSchema={createAdminValidation}
                    onSubmit={handleCreateAdminSubmit}
                >
                    <Form className='flex flex-col gap-6'>
                        <span className='w-full flex flex-col sm:flex-row gap-2'>
                            <Input name='firstName' label='First Name' hasValidation />
                            <Input name='otherNames' label='Other Names' hasValidation />
                        </span>
                        <Input name='lastName' label='Last Name' hasValidation />
                        <span className='w-full flex flex-col sm:flex-row gap-2'>
                            <SelectInput
                                className='w-full'
                                label='Role'
                                hasValidation
                                options={[
                                    {
                                        label: "Administrator",
                                        value: "ADMIN"
                                    },
                                    {
                                        label: "Super User",
                                        value: "SUDO"
                                    },
                                ]}
                                name='role'
                                />
                            <SelectInput
                                className='w-full'
                                label='Gender'
                                hasValidation
                                options={[
                                    {
                                        label: "Male",
                                        value: "Male"
                                    },
                                    {
                                        label: "Female",
                                        value: "Female"
                                    },
                                ]}
                                name='gender'
                                />
                        </span>
                        <span className='w-full flex flex-col sm:flex-row gap-2'>
                            <Input name='email' label='Email Address' iconType='email' hasValidation />
                            <Input name='phone' label='Phone Number' iconType='phone' hasValidation />
                        </span>
                        <span className='flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4 w-full'>
                            <Button className='px-3 !h-[35px]' type='button' onClick={()=>{  toggleManager.toggle('create-dialog'); toggleManager.reset('create-dialog') }} variant='neutral'>Close</Button>
                            <Button className='px-3 !h-[35px]' type='submit' isLoading={toggleManager.get('create-is-loading')}>Add Administrator</Button>
                        </span>
                    </Form>
                </Formik>
            </DialogContainer>
            <DialogContainer
                toggleOpen={() => {toggleManager.toggle('update-dialog')}}
                isOpen={toggleManager.get('update-dialog')}
                title={`Update Administrator`}
                description={`Update ${ selectedAdmin.firstName + " " + selectedAdmin.lastName }'s details`}
            >
                <Formik
                    initialValues={updateAdminInitialValues}
                    validationSchema={updateAdminValidation}
                    onSubmit={handleUpdateAdminSubmit}
                >
                    <Form className='flex flex-col gap-6'>
                        <span className='w-full flex flex-col sm:flex-row gap-2'>
                            <Input name='firstName' label='First Name' hasValidation />
                            <Input name='otherNames' label='Other Names' hasValidation />
                        </span>
                        <Input name='lastName' label='Last Name' hasValidation />
                        <span className='w-full flex flex-col sm:flex-row gap-2'>
                            <SelectInput
                                className='w-full'
                                label='Gender'
                                hasValidation
                                options={[
                                    {
                                        label: "Male",
                                        value: "Male"
                                    },
                                    {
                                        label: "Female",
                                        value: "Female"
                                    },
                                ]}
                                name='gender'
                                />
                        </span>
                        <span className='w-full flex flex-col sm:flex-row gap-2'>
                            <Input name='email' label='Email Address' iconType='email' hasValidation />
                            <Input name='phone' label='Phone Number' iconType='phone' hasValidation />
                        </span>
                        <span className='flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4 w-full'>
                            <Button className='px-3 !h-[35px]' type='button' onClick={()=>{ toggleManager.toggle('update-dialog'); toggleManager.reset('update-dialog')}} variant='neutral'>Close</Button>
                            <Button className='px-3 !h-[35px]' type='button' variant='danger' isLoading={toggleManager.get('update-is-loading')} onClick={handleToggleRole}>{ selectedAdmin.role == "SUDO" ? "Downgrade to ADMIN" : "Upgrade to SUDO" }</Button>
                            <Button className='px-3 !h-[35px]' type='submit' isLoading={toggleManager.get('update-is-loading')}>Update Administrator</Button>
                        </span>
                    </Form>
                </Formik>
                

            </DialogContainer>
            <DialogContainer
                title='Delete Administrator'
                description={`Are you sure you want to delete the ${selectedAdmin.firstName} ${selectedAdmin.lastName} account?`}
                isOpen={toggleManager.get('delete-dialog')}
                toggleOpen={()=>{toggleManager.toggle('delete-dialog')}}
            >
                <div className='flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4 mt-8'>
                    <Button variant='neutral' isDisabled={toggleManager.get('delete-is-loading')} onClick={()=> { toggleManager.toggle('delete-dialog'); setSelectedAdmin({}) }}>Close</Button>
                    <Button variant='danger' isLoading={toggleManager.get('delete-is-loading')} onClick={handleDeleteAdmin}>Delete Administrator</Button>
                </div>
            </DialogContainer>
            <DialogContainer
                isOpen={toggleManager.get('view-dialog')}
                onClose={()=>toggleManager.reset('view-dialog')}
                toggleOpen={() => toggleManager.toggle('view-dialog')}
                title={`View Admin`}
                description={`Details of ${selectedAdmin.role == "SUDO" ? "Super User": "Administrator"} ${selectedAdmin.firstName} ${selectedAdmin.lastName}`}
            >
                <div className="flex flex-col gap-4 sm:justify-between">
                    <div className='w-full'>
                        <div className='bg-white w-full overflow-auto grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light " >ADMIN CODE</span>
                            <p className="text-md" >
                            {selectedAdmin.code}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light " >FULL NAME</span>
                            <p className="text-md" >
                            {selectedAdmin.firstName}
                            {selectedAdmin.otherNames == "" ? " " : " " + selectedAdmin.otherNames + " "}
                            {selectedAdmin.lastName}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light " >GENDER</span>
                            <span className="text-md" >{selectedAdmin.gender}</span>
                        </div>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light ">EMAIL ADDRESS</span>
                            <span className="text-md">{selectedAdmin.email}</span>
                        </div>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light ">PHONE NUMBER</span>
                            <span className="text-md" >{selectedAdmin.phone}</span>
                        </div>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light ">MODE OF CLASS</span>
                            <span className="text-md" >{selectedAdmin.modeOfClass ?? "N/A"}</span>
                        </div>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light ">CLASSES</span>
                            <span className="flex gap-2 flex-wrap">
                            {!!selectedAdmin.classes?.length && selectedAdmin.classes.map((course, idx) => {
                                return (
                                <span key={idx} className="text-md" >
                                    {course.name}
                                </span>
                                );
                            })}
                            { !selectedAdmin.classes?.length && <span className="text-md">No Class Indicated</span> }
                            </span>

                        </div>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 sm:justify-end">
                        <Button
                            variant="neutral" 
                            onClick={() => {toggleManager.reset('view-dialog')}}
                        >
                        Close
                        </Button>
                        <Button
                            variant="danger" 
                            onClick={() => {toggleManager.reset('view-dialog'); toggleManager.toggle('delete-dialog')}}
                        >
                        Delete Admin
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={() => {toggleManager.reset('view-dialog'); toggleManager.toggle('update-dialog') }}
                        >
                        Update Admin
                        </Button>
                    </div>
                </div>
            </DialogContainer>

            <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1'>
                <div className='mt-2 flex h-fit justify-between items-center'>
                    <h3 className='text-blue-800'>Administrators</h3>
                    <div className='flex gap-2 sm:gap-4'>
                        <div className='w-full flex flex-wrap gap-2 sm:gap-4'>
                            <Button
                                onClick={()=>{ toggleManager.toggle('filters-is-shown')}}
                                variant='outline'
                                className='!h-[35px] px-2 flex items-center gap-2'
                            >
                                <FunnelIcon className='w-4' />
                                <span className='hidden sm:inline'>{ toggleManager.get('filters-is-shown') ? "Close" : "Show"} Filters</span>
                            </Button>

                            { toggleManager.get('filters-is-shown') &&
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

                            }
                            <div className='flex flex-col justify-end'>
                                <Button className='!h-[35px] px-2' variant='outline' onClick={manuallyToggleCompositeFilterFlag}> <ArrowPathIcon className='w-4' /> </Button>
                            </div>
                        </div>
                        <Button className='flex shrink-0' onClick={()=>{toggleManager.toggle('create-dialog')}}> <PlusIcon className='inline w-4 mr-1' /><span className='hidden sm:inline' > Add an administrator</span></Button>
                    </div>
                </div>
                <div className='w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow'>
                    <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
                        <div className = 'w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                            <div className='flex items-center gap-4'>
                                <span  className='w-[40px]'>ROLE</span>
                                <span className='flex-1 font-normal truncate'>NAME</span>
                            </div>
                            <div className='flex gap-4 items-center font-light'>
                                <span className='w-[150px] hidden sm:flex justify-end'>DATE CREATED</span>
                                <span className='w-[100px] flex justify-end'>ACTIONS</span>
                            </div>
                        </div>
                        {
                            administratorsIsLoading && 
                            <div className='w-full h-full m-auto mt-4'>

                                <div
                                    className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                                ></div>
                            </div>
                        } 
                        { 
                        !administratorsIsLoading && administrators.map((admin, idx) => {
                            return (
                            <div 
                                key={idx} 
                                className = 'w-full cursor-pointer text-blue-700 py-2 px-1 sm:px-2 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'
                                onClick={() => {
                                    // @ts-ignore
                                    setSelectedAdmin(admin); 
                                    toggleManager.toggle('view-dialog')}}
                            >
                                <div className='flex items-center gap-4'>
                                    <small className='font-light w-[40px]'>{admin.role}</small>
                                    <span className='flex-1 font-normal truncate'>{admin.firstName + " " + admin.lastName }</span>
                                </div>
                                <div className='flex gap-4 items-center font-light'>
                                    <span className='w-[150px] hidden sm:flex justify-end'>{dayjs(admin.createdAt).format("HH:mm - DD/MM/YYYY")}</span>
                                    <div className='w-[100px] flex justify-end gap-4'>
                                        <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={(e) => { 
                                            e.preventDefault(); 
                                            e.stopPropagation();
                                            // @ts-ignore
                                            setSelectedAdmin(admin); 
                                            toggleManager.toggle('update-dialog') }}>              
                                            <PencilIcon className='w-4 h-4' />
                                        </span>
                                        <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={(e) => { 
                                                e.preventDefault(); 
                                                e.stopPropagation();
                                                // @ts-ignore
                                                setSelectedAdmin(admin); 
                                                toggleManager.toggle('delete-dialog') 
                                            }}>
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
                    <p>Showing <span className='font-semibold'>{administrators.length}</span> of <span className='font-semibold'>{administratorsCount}</span></p>
                </div>
            </div>
        </>
    )

}


const createAdminInitialValues = {
    firstName: "",
    otherNames: "",
    lastName: "",
   
    email: "",
    phone: "",
   
    role: "ADMIN",
    gender: "Male"
}


const createAdminValidation = yup.object({
    firstName: yup.string().required("Please enter the first name").min(2, "First name is too short").max(256, "First name is too short"),
    otherNames: yup.string().min(2, "Other names is too short").max(256, "Other names is too long"),
    lastName: yup.string().required("Please enter the last name").min(2, "Last name is too short").max(256, "Last name is too long"),

    email: yup.string()
        .email("Please enter a valid email")
        .required('Please enter your email address')
        .matches(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/)
        .min(4, 'Email is too short')
        .max(64, "Email is too long"),
    phone: yup.string()
        .required("Please enter your phone number")
        .min(10, "Phone number must be 10 digits")
        .max(10, "Phone number must be 10 digits")
        .matches(/^[0-9]*$/, "Please enter a valid phone number"),

    role: yup.string().required("Please select a role").oneOf(["SUDO", "ADMIN"]),
    gender: yup.string().required("Please select a role").oneOf(["Male", "Female"]),

})

const updateAdminValidation = yup.object({
    firstName: yup.string().required("Please enter the first name").min(2).max(256),
    otherNames: yup.string().min(2).max(256),
    lastName: yup.string().required("Please enter the last name").min(2).max(256),

    email: yup.string()
        .email("Please enter a valid email")
        .required('Please enter your email address')
        .matches(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/)
        .min(4, 'Email is too short')
        .max(64, "Email is too long"),
    phone: yup.string()
        .required("Please enter your phone number")
        .min(10, "Phone number must be 10 digits")
        .max(10, "Phone number must be 10 digits")
        .matches(/^[0-9]*$/, "Please enter a valid phone number"),

    gender: yup.string().required("Please select a role").oneOf(["Male", "Female"]),

})
