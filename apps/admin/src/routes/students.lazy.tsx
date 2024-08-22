import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, DialogContainer, Input, SelectInput } from '@repo/ui'
import { _getToken, makeAuthenticatedRequest, useDialog, useLoading, useToggleManager, validPhoneNumber } from '@repo/utils';
import { FunnelIcon, ArrowPathIcon, PencilIcon } from '@heroicons/react/24/outline'
import { useStudents } from '../hooks/students.hook';
import { useCompositeFilterFlag, useSpecificEntity } from '../hooks';
import { IUserDoc } from '@repo/models';
import { useState } from 'react';
import { toast } from 'sonner'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import dayjs from 'dayjs';
import { IClassDoc } from '@repo/models';

export const Route = createLazyFileRoute('/students')({
  component: Students
})




function Students(){

  const initialToggles = {
      'update-is-loading': false,
      'update-dialog': false,
      'view-dialog': false,
      
      'filter-is-shown': false,
      'refresh': false,
  }
  
  type TogglesType = typeof initialToggles
  type ToggleKeys = keyof TogglesType
  const toggleManager = useToggleManager<ToggleKeys>(initialToggles);

  const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ toggleManager.get('refresh') ])

  const { students, count: studentsCount, isLoading: studentsIsLoading } = useStudents(compositeFilterFlag);

  const { entity: selectedStudent, setSelected, resetSelected } = useSpecificEntity<Omit<Partial<IUserDoc>, "classes"> & { classes: IClassDoc[] }>()
  
  
  function UpdateDialog(){
    
    const updateStudentInitialValues = {
      firstName: selectedStudent?.firstName ?? "",
      otherNames: selectedStudent?.otherNames ?? "",
      lastName: selectedStudent?.lastName ?? "",
    
      email: selectedStudent?.email ?? "",
      phone: "0" + selectedStudent?.phone?.substring(3) ?? "",
    
      gender: selectedStudent?.gender ?? "Male"
    }

    function handleUpdateStudentSubmit(values:{
      firstName: string,
      otherNames: string,
      lastName: string,
      email: string,
      gender: string,
      phone: string,
  }){
      if(!selectedStudent) return

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
          `/api/v1/users/${selectedStudent._id}`,
          {
              ...changedValues,
              authToken: _getToken()
          }
      ).then( res => {
          if(res.status == 200 && res.data.success){
              toast.success("Student Updated Successfully")
              toggleManager.toggle('refresh')
              toggleManager.reset('update-dialog')
          } else {
              values.phone = "0" + selectedStudent.phone?.substring(3)
              toast.error(`${res.data.error.msg}`)
          }
      })
      .catch( err => {
          values.phone = "0" + selectedStudent.phone?.substring(3)
          toast.error(`${err}`)
      })
      .finally(()=> {
        toggleManager.reset('update-is-loading')
      })
    }

    return (
      <>
        <DialogContainer
          toggleOpen={()=>{ toggleManager.toggle('update-dialog') }}
          isOpen={toggleManager.get('update-dialog')}
          title={`Update Student`}
          description={`Update ${ selectedStudent?.firstName + " " + selectedStudent?.lastName }'s details`}
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
                      <Button className='px-3 !h-[35px]' 
                        type='button' 
                        onClick={()=>{ toggleManager.reset('update-dialog'); }} 
                        variant='neutral'
                      >Close</Button>
                      <Button className='px-3 !h-[35px]' 
                        type='submit' 
                        isLoading={toggleManager.get('update-is-loading')}
                      >Update Student</Button>
                  </span>
              </Form>
          </Formik>

      </DialogContainer>
      </>
    )
  }

  function ViewDialog(){
    if(!selectedStudent) return

    return (
      <DialogContainer
                isOpen={toggleManager.get('view-dialog')}
                onClose={()=>toggleManager.reset('view-dialog')}
                toggleOpen={() => toggleManager.toggle('view-dialog')}
                title={`View Admin`}
                description={`Details of ${selectedStudent.firstName} ${selectedStudent.lastName}`}
            >
                <div className="flex flex-col gap-4 sm:justify-between">
                    <div className='w-full'>
                        <div className='bg-white w-full overflow-auto grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light " >ADMIN CODE</span>
                            <p className="text-md" >
                            {selectedStudent.code}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light " >FULL NAME</span>
                            <p className="text-md" >
                            {selectedStudent.firstName}
                            {selectedStudent.otherNames == "" ? " " : " " + selectedStudent.otherNames + " "}
                            {selectedStudent.lastName}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light " >GENDER</span>
                            <span className="text-md" >{selectedStudent.gender}</span>
                        </div>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light ">EMAIL ADDRESS</span>
                            <span className="text-md">{selectedStudent.email}</span>
                        </div>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light ">PHONE NUMBER</span>
                            <span className="text-md" >{selectedStudent.phone}</span>
                        </div>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light ">MODE OF CLASS</span>
                            <span className="text-md" >{selectedStudent.modeOfClass ?? "N/A"}</span>
                        </div>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light ">CLASSES</span>
                            <span className="flex gap-2 flex-wrap">
                            {!!selectedStudent.classes?.length && selectedStudent.classes.map((course, idx) => {
                                return (
                                <span key={idx} className="text-md" >
                                    {course.name}
                                </span>
                                );
                            })}
                            { !selectedStudent.classes?.length && <span className="text-md">No Class Indicated</span> }
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
                    </div>
                </div>
            </DialogContainer>
    )

  }



  return (
    <>
      {toggleManager.get("update-dialog") && <UpdateDialog />}
      {toggleManager.get('view-dialog') && <ViewDialog />}
      <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full'>
        <div className='flex justify-between mt-2 gap-2 items-center'>
          <h3 className='text-blue-800'>Students</h3>     
          <div className='flex gap-3'>
              <div  className='w-full flex flex-wrap gap-3'>
                  <div className='flex flex-col gap-2 justify-end'>
                    <Button className='!h-[35px] px-2' variant='outline' onClick={() => {toggleManager.toggle('refresh') }}> <ArrowPathIcon className='w-4' /> </Button>
                  </div>
              </div> 
          </div>
        </div>
          <div className='w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow'>
            <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
              <div className = 'w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                <div className='flex items-center gap-4'>
                    <span  className='w-[70px]'>CODE</span>
                    <span className='flex-1 font-normal truncate'>NAME</span>
                  </div>
                  <div className='hidden sm:flex gap-4 items-center font-light'>
                      <span className='w-[150px] flex justify-end'>DATE CREATED</span>
                      <span className='w-[70px] flex justify-end'>ACTIONS</span>
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
                      <div key={idx} 
                        className = 'cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10'
                        onClick={() => { 
                          // @ts-ignore
                          setSelected(student); 
                          toggleManager.toggle('view-dialog') 
                          }} >
                        <div className='flex items-center gap-4'>
                            <small className='font-light w-[70px]'>{student.code}</small>
                            <span className='flex-1 font-normal truncate'>{student.firstName + " " + student.lastName }</span>
                        </div>
                        <div className='hidden sm:flex gap-4 items-center font-light'>
                            <span className='w-[150px] flex justify-end'>{dayjs(student.updatedAt).format("HH:mm - DD/MM/YYYY")}</span>
                            <span className='w-[70px] flex justify-end'>
                              <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={(e) => { 
                                  e.preventDefault(); 
                                  e.stopPropagation();
                                  // @ts-ignore
                                  setSelected(student); 
                                  toggleManager.toggle('update-dialog') }}
                              >              
                                <PencilIcon className='w-4 h-4' />
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