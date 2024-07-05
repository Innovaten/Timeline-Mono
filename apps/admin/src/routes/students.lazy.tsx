import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, DialogContainer, Input, SelectInput } from '@repo/ui'
import { _getToken, makeAuthenticatedRequest, useDialog, useLoading, validPhoneNumber } from '@repo/utils';
import { FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useModeOfClassFilter, useStudents } from '../hooks/students.hook';
import { useCompositeFilterFlag } from '../hooks';
import { IUserDoc } from '@repo/models';
import { useState } from 'react';
import { toast } from 'sonner'
import { Formik, Form } from 'formik'
import * as yup from 'yup'

export const Route = createLazyFileRoute('/students')({
  component: Students
})




function Students(){
  const { dialogIsOpen: filterIsShown, toggleDialog: toggleFiltersAreShown } = useDialog();
  const { dialogIsOpen: refreshFlag, toggleDialog: toggleRefreshFlag } = useDialog();
  const { filter: modeOfClassFilter, changeFilter: modeOfClassChangeFilter, filterOptions: modeOfClassFilterOptions, filterChangedFlag: modeOfClassFilterChangedFlag } = useModeOfClassFilter();

  const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ modeOfClassFilterChangedFlag, refreshFlag ])


  const { students, count: studentsCount, isLoading: studentsIsLoading } = useStudents(compositeFilterFlag, modeOfClassFilter);
  const { dialogIsOpen: updateDialogIsOpen, toggleDialog: toggleUpdateDialog } = useDialog();
  const { isLoading: updateIsLoading, toggleLoading: toggleUpdateLoading, resetLoading: resetUpdateLoading } = useLoading()


  const [ selectedStudent, setSelectedStudent ] = useState<Partial<IUserDoc>>({
    firstName: '',
    otherNames: '',
    lastName: '',
    gender: 'Male',
    email: '',
    phone: '',
  });

  const updateStudentInitialValues = {
    firstName: selectedStudent.firstName ?? "",
    otherNames: selectedStudent.otherNames ?? "",
    lastName: selectedStudent.lastName ?? "",
  
    email: selectedStudent.email ?? "",
    phone: "0" + selectedStudent.phone?.substring(3) ?? "",
  
    gender: selectedStudent.gender ?? "Male"
  }

  function handleUpdateStudentSubmit(values:{
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
        `/api/v1/users/${selectedStudent._id}`,
        {
            ...changedValues,
            authToken: _getToken()
        }
    ).then( res => {
        if(res.status == 200 && res.data.success){
            toast.success("Student Updated Successfully")
            toggleRefreshFlag()
        } else {
            values.phone = "0" + selectedStudent.phone?.substring(3)
            toast.error(`${res.data.error.msg}`)
        }
        toggleUpdateDialog()
        resetUpdateLoading()
    })
    .catch( err => {
        values.phone = "0" + selectedStudent.phone?.substring(3)
        toast.error(`${err}`)
        resetUpdateLoading()
    })
}



  return (
    <>
      <DialogContainer
          toggleOpen={toggleUpdateDialog}
          isOpen={updateDialogIsOpen}
          title={`Update Student`}
          description={`Update ${ selectedStudent.firstName + " " + selectedStudent.lastName }'s details`}
      >
          <Formik
              initialValues={updateStudentInitialValues}
              validationSchema={updateStudentValidation}
              onSubmit={handleUpdateStudentSubmit}
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
                      <Button className='px-3 !h-[35px]' type='submit' isLoading={updateIsLoading}>Update Student</Button>
                  </span>
              </Form>
          </Formik>

      </DialogContainer>
      <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full'>
        <h2 className='text-blue-800 mt-2'>Students</h2>     
          <div className='w-full flex gap-3 mt-2'>
              <div  className='w-full flex flex-wrap gap-3 mt-2 '>
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
                        <small className='text-blue-700'>Mode of Class</small>
                        <select
                            className='text-base text-blue-600 border-[1.5px] focus:outline-blue-300 focus:ring-0  rounded-md border-slate-300 shadow-sm h-[35px] px-2'
                            onChange={(e) => { 
                                // @ts-ignore
                                modeOfClassChangeFilter(e.target.value)
                            }}
                        >
                            { 
                                modeOfClassFilterOptions.map((f, idx) =>{ 
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
                  <Button className='!h-[35px] px-2' variant='outline' onClick={()=> modeOfClassChangeFilter("All")}> <ArrowPathIcon className='w-4' /> </Button>
                </div>
              </div> 
          </div>
          <div className='w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow-sm'>
            <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
              <div className = 'w-full text-blue-700 py-2 px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                <div className='flex items-center gap-4'>
                    <span  className='w-[50px]'>CODE</span>
                    <span className='flex-1 font-normal truncate'>NAME</span>
                  </div>
                  <div className='hidden sm:flex gap-4 items-center font-light'>
                      <span className='w-[100px] flex justify-end'>DATE CREATED</span>
                      <span className='w-[150px] flex justify-end'></span>
                  </div>
                </div>
                {
                    studentsIsLoading  && 
                      <div className='w-full h-full m-auto'>
                        <div
                            className='w-5 aspect-square m-auto mt-4 rounded-full border-[1px] border-t-blue-500 animate-spin' 
                        ></div>
                    </div>
                } 
                { 
                  !studentsIsLoading && students.map((student, idx) => {
                      return (
                      // Onclick trigger a dialog
                      <div key={idx} onClick={() => { setSelectedStudent(student); toggleUpdateDialog() }} className = 'cursor-pointer w-full text-blue-700 py-2 px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'>
                        <div className='flex items-center gap-4'>
                            <small className='font-light w-[50px]'>{student.code}</small>
                            <h5 className='flex-1 font-normal truncate'>{student.firstName + " " + student.lastName }</h5>
                        </div>
                        <div className='hidden sm:flex gap-4 items-center font-light'>
                            <span className='w-[100px] flex justify-end'>{new Date(student.updatedAt).toLocaleTimeString()}</span>
                            <span className='w-[150px] flex justify-end'>{new Date(student.updatedAt).toDateString()}</span>
                        </div>
                    </div>
                      )
                  })
                }
            </div>
        </div>
        <div className='flex justify-end text-blue-700 mt-2'>
            <p>Showing <span className='font-semibold'>{students.length}</span> of <span className='font-semibold'>{studentsCount}</span></p>
        </div>
      </div>
    </>
  )

}

const updateStudentValidation = yup.object({
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