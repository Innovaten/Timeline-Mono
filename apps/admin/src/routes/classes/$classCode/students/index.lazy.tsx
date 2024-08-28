import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, DialogContainer, Input, SelectInput } from '@repo/ui'
import { _getToken, abstractAuthenticatedRequest, makeAuthenticatedRequest, useDialog, useLoading, useToggleManager, validPhoneNumber } from '@repo/utils';
import { FunnelIcon, ArrowPathIcon, PencilIcon, UserMinusIcon } from '@heroicons/react/24/outline'
import { useClass, useStudents, useStudentsInClass } from '../../../../hooks';
import { useCompositeFilterFlag, useSpecificEntity } from '../../../../hooks';
import { IUserDoc } from '@repo/models';
import { useMemo, useState } from 'react';
import { toast } from 'sonner'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import dayjs from 'dayjs';
import { IClassDoc } from '@repo/models';
import { useLMSContext } from '../../../../app';

export const Route = createLazyFileRoute('/classes/$classCode/students/')({
  component: ClassStudents
})


function ClassStudents(){

  const { user } = useLMSContext()
  const { classCode } = Route.useParams()

  const initialToggles = {
      'update-is-loading': false,
      'update-dialog': false,
      'view-dialog': false,
      'remove-dialog': false,
      'remove-is-loading': false,

      'add-dialog': false,
      'add-is-loading': false,
      
      'filter-is-shown': false,
      'refresh': false,
  }
  
  type TogglesType = typeof initialToggles
  type ToggleKeys = keyof TogglesType
  const toggleManager = useToggleManager<ToggleKeys>(initialToggles);

  const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ toggleManager.get('refresh') ])

  const { thisClass, isLoading: classIsLoading } = useClass(compositeFilterFlag, classCode, false)
  const { students, isLoading: studentsIsLoading } = useStudentsInClass(compositeFilterFlag, classCode, false);

  const { entity: selectedStudent, setSelected, resetSelected } = useSpecificEntity<Omit<Partial<IUserDoc>, "classes"> & { classes?: IClassDoc[] }>()
  
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
                title={`View Student`}
                description={`Details of ${selectedStudent.firstName} ${selectedStudent.lastName}`}
            >
                <div className="flex flex-col gap-4 sm:justify-between">
                    <div className='w-full'>
                        <div className='bg-white w-full overflow-auto grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        <div className="flex flex-col gap-1" >
                            <span className="text-xs font-light " >STUDENT CODE</span>
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

  function AddStudentDialog(){
        
    const { entity: selectedStudent, setSelected: setSelectedStudent, resetSelected: resetSelectedStudent } = useSpecificEntity<IUserDoc | null>(); 

    const { students, isLoading: studentsIsLoading } = useStudents(classIsLoading, {}, 1000, 0)


    function handleAddStudent(){

        if(!selectedStudent) {
            toast.error("Kindly select a student")
            return
        }


        abstractAuthenticatedRequest(
            "patch",
            `/api/v1/classes/${classCode}/add-student/${selectedStudent.code}?classIsId=false&studentIsId=false`,
            {},
            {},
            {
                onStart: ()=>{toggleManager.toggle('add-is-loading')},
                onSuccess: (data) => {
                    toast.success("Student added successfully");
                    manuallyToggleCompositeFilterFlag();
                    toggleManager.toggle('add-dialog');
                    toggleManager.toggle('refresh')
                },
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: () => {toggleManager.reset('add-is-loading')}
            }
        )
    }

    const filteredStudents = students.filter(s => !s.classes.map(c => `${c._id}`).includes(`${thisClass?._id}`))

    return (
        <>
            <DialogContainer
            title='Add Student'
            description={`Kindly select the student you want to add to class ${thisClass?.name}`}
            isOpen={toggleManager.get('add-dialog')}
            toggleOpen={()=>{ toggleManager.toggle('add-dialog') }}
        >
            <div className='flex flex-col gap-2'>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-48 overflow-y-auto">
                    {
                        studentsIsLoading && 
                        <div className='col-span-1 sm:col-span-2 flex p-4 items-center justify-center'>
                            <span className='w-4 h-4 rounded-full border-[1.5px] border-t-blue-600 animate-spin'></span>
                        </div>
                    }
                    {
                        !studentsIsLoading && filteredStudents.map((student, idx) => (<>
                            <div
                                key={idx} onClick={()=>{
                                    // @ts-ignore
                                    setSelectedStudent(student)
                                }}
                            className={`flex gap-2 items-center rounded p-2 hover:bg-blue-100/40 hover:border-blue-100 cursor-pointer duration-150 border-2 ${ 
                                // @ts-ignore
                                selectedStudent == student ? "border-blue-700/40" : "border-transparent"}`}  >
                                <div className='rounded-full flex-shrink-0 aspect-square h-full bg-blue-100 text-blue-700 font-light grid place-items-center'>{student.firstName[0]+student.lastName[0]}</div>
                                <div className='flex flex-col truncate text-ellipsis'>
                                    <p className='text-ellipsis'>{student.firstName} {student.lastName}</p>
                                    <small className='text-ellipsis'>{student.email}</small>
                                </div>
                            </div>
                        </>
                        ))
                    }
                </div>
                <div className='flex w-full justify-end gap-4 mt-4'>
                    <Button className='!h-[35px] px-2' 
                        variant='neutral' 
                        onClick={()=> { 
                            toggleManager.reset('add-dialog'); 
                            resetSelectedStudent()
                        }}
                    >Close</Button>
                    <Button className='!h-[35px] px-2'  
                        isLoading={toggleManager.get('add-is-loading')} 
                        onClick={handleAddStudent}
                    >Add Student</Button>
                </div>
            </div>
        </DialogContainer>
        </>
    )
  }

  function RemoveDialog(){

    if(!selectedStudent) return

    function handleRemoveStudent(){
    
      abstractAuthenticatedRequest(
        "patch",
        `/api/v1/classes/${classCode}/remove-student/${selectedStudent?.code}?classIsId=false&studentIsId=false`,
        {}, {},
        {
          onStart: ()=> { toggleManager.toggle('remove-is-loading')},
          onSuccess: () => {toast.success("Student removed successfully"), toggleManager.reset('remove-dialog'); toggleManager.toggle('refresh')},
          onFailure: (err) => { toast.error(`${err.msg}`)},
          finally: () => { toggleManager.reset('remove-is-loading')}
        }
      )
    }

    return (
      <>
        <DialogContainer
          title='Remove Student'
          description={`Are you sure you want to remove the ${selectedStudent.firstName} ${selectedStudent.lastName} from this class?`}
          isOpen={toggleManager.get('remove-dialog')}
          toggleOpen={()=>{toggleManager.toggle('remove-dialog')}}
        >
            <div className='flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4 mt-8'>
                <Button variant='neutral' isDisabled={toggleManager.get('remove-is-loading')} onClick={()=> { toggleManager.toggle('remove-dialog'); resetSelected() }}>Close</Button>
                <Button variant='danger' isLoading={toggleManager.get('remove-is-loading')} onClick={handleRemoveStudent}>Remove Student</Button>
            </div>
        </DialogContainer>
      </>
    )

  }


  return (
    <>
      {toggleManager.get("update-dialog") && user?.role === "SUDO"  && <UpdateDialog />}
      {toggleManager.get("add-dialog") && user?.role === "SUDO"  && <AddStudentDialog />}
      {toggleManager.get("remove-dialog") && user?.role === "SUDO"  && <RemoveDialog />}
      {toggleManager.get('view-dialog') && <ViewDialog />}
      <div className='flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full'>
        <div className='flex justify-between mt-2 gap-2 items-center'>
          <h3 className='text-blue-800'>Students</h3>     
          <div className='flex gap-3'>
              <div  className='w-full flex flex-wrap gap-3'>
                  { user?.role == "SUDO" &&
                    <Button
                      onClick={()=>{toggleManager.toggle('add-dialog')}}
                    >Add New Student</Button>
                  }
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
                      <span className='w-[100px] flex justify-end'>ACTIONS</span>
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
                              { user?.role == "SUDO" && 
                                <>
                                  <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={(e) => { 
                                      e.preventDefault(); 
                                      e.stopPropagation();
                                      // @ts-ignore
                                      setSelected(student); 
                                      toggleManager.toggle('update-dialog') }}
                                  >              
                                    <PencilIcon className='w-4 h-4' />
                                  </span>
                                  <span className='grid place-items-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-200 cursor-pointer duration-150' onClick={(e) => { 
                                    e.preventDefault(); 
                                    e.stopPropagation();
                                    // @ts-ignore
                                    setSelected(student); 
                                    toggleManager.toggle('remove-dialog') }}
                                  >              
                                  <UserMinusIcon className='w-4 h-4' />
                                </span>
                              </>
                            }
                            </span>
                        </div>
                    </div>
                      )
                  })
                }
            </div>
        </div>
        <div className='flex justify-end text-blue-700 mt-2 pb-2'>
            <p>Showing <span className='font-semibold'>{students.length}</span> of <span className='font-semibold'>{students.length}</span></p>
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