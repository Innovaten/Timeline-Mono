import { Button, DialogContainer, Input } from '@repo/ui';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useAdministrators, useAdministratorsFilter, useCompositeFilterFlag } from '../hooks';
import { PlusIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import * as yup from 'yup'
import { _getToken, makeAuthenticatedRequest, useDialog, useLoading, validPhoneNumber } from '@repo/utils';
import { Formik, Form } from 'formik'
import { SelectInput } from '@repo/ui';
import { toast } from 'sonner'
import { useState } from 'react';
import { IUserDoc } from '@repo/models';

export const Route = createLazyFileRoute('/administrators')({
    component: Administrators
})


function Administrators(){

    const { filter, filterOptions, changeFilter, filterChangedFlag } = useAdministratorsFilter();
    const { dialogIsOpen: refreshFlag, toggleDialog: toggleRefreshFlag } = useDialog();
    const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ filterChangedFlag, refreshFlag ])

    const { isLoading: administratorsIsLoading, administrators, count: administratorsCount } = useAdministrators(compositeFilterFlag, filter);
    const { dialogIsOpen, toggleDialog: toggleCreateDialog } = useDialog();
    const { dialogIsOpen: updateDialogIsOpen, toggleDialog: toggleUpdateDialog } = useDialog();
    const { dialogIsOpen: filterIsShown, toggleDialog: toggleFiltersAreShown } = useDialog();
    const { isLoading, toggleLoading, resetLoading } = useLoading()
    const { isLoading: updateIsLoading, toggleLoading: toggleUpdateLoading, resetLoading: resetUpdateLoading } = useLoading()


    const [ selectedAdmin, setSelectedAdmin ] = useState<Partial<IUserDoc>>({
        firstName: '',
        otherNames: '',
        lastName: '',
        gender: 'Male',
        email: '',
        phone: '',
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
        toggleUpdateLoading()
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
                toggleRefreshFlag()
            } else {
                values.phone = "0" + selectedAdmin.phone?.substring(3)
                toast.error(`${res.data.error.msg}`)
            }
            toggleUpdateDialog()
            resetUpdateLoading()
        })
        .catch( err => {
            values.phone = "0" + selectedAdmin.phone?.substring(3)
            toast.error(`${err}`)
            resetUpdateLoading()
        })
    }
    
    function handleToggleRole(){

        toggleUpdateLoading()
        const baseUrl = "/api/v1/users/"
        const finalUrl = baseUrl +  (selectedAdmin.role == "SUDO" ? 'downgrade-to-admin?sudoId=' : "upgrade-to-sudo?adminId=" ) + selectedAdmin._id;
        
        makeAuthenticatedRequest(
            "get",
            finalUrl,
        )
        .then( res => {
            if(res.status == 201 && res.data.success){
                const successText = selectedAdmin.role == "SUDO" ? "User downgraded to Administrator successfully": "User upgraded to Sudo successfully";
                toast.success(successText);
                toggleUpdateDialog()
                toggleRefreshFlag()
            } else {
                toast.error(`${res.data.error.msg}`)
            }
            resetUpdateLoading()
        })
        .catch(err => {
            toast.error(`${err}`)
            resetUpdateLoading()
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
        toggleLoading()

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
                toggleCreateDialog()
                toggleLoading()
                toast.success(<p>Admin created successfully.<br/>A confirmation will be sent via email.</p>)
                toggleRefreshFlag()
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
                toggleOpen={toggleCreateDialog}
                isOpen={dialogIsOpen}
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
                        <span className='flex justify-end gap-4 w-full'>
                            <Button className='px-3 !h-[35px]' type='button' onClick={()=>{ toggleCreateDialog(); resetLoading()}} variant='neutral'>Close</Button>
                            <Button className='px-3 !h-[35px]' type='submit' isLoading={isLoading}>Add Administrator</Button>
                        </span>
                    </Form>
                </Formik>
            </DialogContainer>
            <DialogContainer
                toggleOpen={toggleUpdateDialog}
                isOpen={updateDialogIsOpen}
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
                        <span className='flex justify-end gap-4 w-full'>
                            <Button className='px-3 !h-[35px]' type='button' onClick={()=>{ toggleUpdateDialog(); resetUpdateLoading()}} variant='neutral'>Close</Button>
                            <Button className='px-3 !h-[35px]' type='button' variant='danger' isLoading={updateIsLoading} onClick={handleToggleRole}>{ selectedAdmin.role == "SUDO" ? "Downgrade to ADMIN" : "Upgrade to SUDO" }</Button>
                            <Button className='px-3 !h-[35px]' type='submit' isLoading={updateIsLoading}>Update Administrator</Button>
                        </span>
                    </Form>
                </Formik>
                

            </DialogContainer>
            <div className='flex flex-col w-full h-full'>
                <div className='mt-2 flex h-fit justify-between items-center'>
                    <h2 className='text-blue-800'>Administrators</h2>
                    <Button className='flex px-2 !h-[35px]' onClick={toggleCreateDialog}> <PlusIcon className='inline w-4 mr-1' /> Add an administrator</Button>
                </div>
                <div className='w-full mt-3 flex gap-4'>
                    <Button
                        onClick={toggleFiltersAreShown}
                        variant='outline'
                        className='!h-[35px] px-2 flex items-center gap-2'
                    >
                        <FunnelIcon className='w-4' />
                        { filterIsShown ? "Close" : "Show"} Filters    
                    </Button>

                    { filterIsShown &&
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
                    <div className='flex flex-col gap-2 justify-end'>
                        <Button className='!h-[35px] px-2' variant='outline' onClick={manuallyToggleCompositeFilterFlag}> <ArrowPathIcon className='w-4' /> </Button>
                    </div>
                </div>
                <div className='w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow-sm'>
                    <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
                        <div className = 'w-full text-blue-700 py-2 px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                            <div className='flex items-center gap-4'>
                                <span  className='w-[50px]'>ROLE</span>
                                <span className='flex-1 font-normal truncate'>NAME</span>
                            </div>
                            <div className='flex gap-4 items-center font-light'>
                                <span className='w-[100px] flex justify-end'>TIME CREATED</span>
                                <span className='w-[150px] flex justify-end'>DATE CREATED</span>
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
                            // Onclick trigger a dialog
                            <div key={idx} onClick={() => { setSelectedAdmin(admin); toggleUpdateDialog() }} className = 'cursor-pointer w-full text-blue-700 py-2 px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'>
                                <div className='flex items-center gap-4'>
                                    <small className='font-light w-[50px]'>{admin.role}</small>
                                    <h5 className='flex-1 font-normal truncate'>{admin.firstName + " " + admin.lastName }</h5>
                                </div>
                                <div className='flex gap-4 items-center font-light'>
                                    <span className='w-[100px] flex justify-end'>{new Date(admin.updatedAt).toLocaleTimeString()}</span>
                                    <span className='w-[150px] flex justify-end'>{new Date(admin.updatedAt).toDateString()}</span>
                                </div>
                            </div>
                            )
                        })
                        }
                    </div>
                </div>
                <div className='flex justify-end text-blue-700 mt-2'>
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
