import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { _getToken } from '@repo/utils';
import { Input, Button } from '@repo/ui'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
import { _setToken, fadeParentAndReplacePage, makeUnauthenticatedRequest, useLoading } from '@repo/utils'
import React, { RefObject, useRef, useState } from 'react'
import { toast } from 'sonner'
import { IRegistrationDoc } from '@repo/models';
import { constants } from '../config';

import { SelectInput } from '../../../../packages/ui/src/components/forms';
YupPassword(Yup);

export const Route = createLazyFileRoute('/register')({
  component: () => <RegisterPage />
})

type RegistrationObjectType = Pick<IRegistrationDoc,
"firstName" |
"otherNames" |
"lastName" |
"email" |
"phone" |
"gender" | 
"code" | 
"modeOfClass" | 
"courses" 
>

function RegisterPage(){

  const [ newUser, setNewUser ] = useState<RegistrationObjectType>({
    code: "",
    firstName: "",
    otherNames: "",
    lastName: "",
    
    email: "",
    phone: "",
    
    gender: "Male",
    
    // @ts-ignore
    modeOfClass: "In-Person",
    courses: []
  }) 
  
  const parentRef = useRef<HTMLDivElement>(null)
  const personalDetailsRef = useRef<HTMLDivElement>(null)
  const contactDetailsRef = useRef<HTMLDivElement>(null)
  const courseDetailsRef = useRef<HTMLDivElement>(null)
  const summaryDetailsRef = useRef<HTMLDivElement>(null)
  const summaryConfirmationRef = useRef<HTMLDivElement>(null)

  const registrationPages: Record<string, RefObject<HTMLDivElement>> = {
    'parent': parentRef,
    'personal-details': personalDetailsRef,
    'contact-details': contactDetailsRef,
    'course-details': courseDetailsRef,
    'summary-details': summaryDetailsRef,
    'registration-complete': summaryConfirmationRef,
  }

  return (
    <>
      <main className="w-full min-h-screen overflow-x-hidden bg-blue-50 md:p-8 2xl:p-12 ">
          <div className="flex flex-col items-center">
              <img className='mb-4 sm:mb-8 h-12' src="/img/timeline-logo.png" />
              <div className='flex w-full h-[90vh] sm:w-[80%] sm:h-fit sm:min-h-[600px] xl:w-[1000px] 2xl:w-[1100px] bg-white rounded shadow overflow-hidden'>
                  <div className='w-1/2 hidden sm:block'>
                      <img className='object-cover h-full' src="/img/login-student-image.jpg" />
                  </div>
                  <div ref={parentRef}  className='w-full sm:w-1/2  p-8'>
                      <PersonalDetailsForm
                        componentRef={registrationPages['personal-details']}
                        registrationPages={registrationPages}

                        setNewUser={setNewUser}
                      />
                      <ContactDetailsForm
                        componentRef={registrationPages['contact-details']}
                        registrationPages={registrationPages}
                        setNewUser={setNewUser} 
                      />
                      <CourseDetailsForm
                        componentRef={registrationPages['course-details']}
                        registrationPages={registrationPages}
                        setNewUser={setNewUser} 
                      />
                      <SummaryDetailsForm
                        componentRef={registrationPages['summary-details']}
                        registrationPages={registrationPages}
                        newUser={newUser}
                        setNewUser={setNewUser}
                      />
                      <SummaryConfirmationForm
                        componentRef={registrationPages['registration-complete']}
                        newUser={newUser}
                      />
                      <div className='absolute flex sm:hidden bottom-10 flex-col items-center w-[calc(100vw-4rem)] m-auto text-blue-600'>
                          <p className='text-center'>&copy; {new Date().getFullYear()} Timeline Trust. All Rights Reserved.</p>
                          <p>Powered By <a>Innovaten</a></p>
                      </div>
                  </div>
                </div>
            </div>
            <div className=' hidden sm:flex bottom-10 flex-col items-center gap-2 md:w-[calc(100vw-4rem)] 2xl:w-calc(100vw-6rem) m-auto mt-8 text-blue-600'>
              <p className='text-center'>&copy; {new Date().getFullYear()} Timeline Trust. All Rights Reserved.</p>
              <p className='text-center'>Powered By <a>Innovaten</a></p>
          </div>
      </main>
    </>
  )
}

type PersonalDetailsProps = {
    componentRef: RefObject<HTMLDivElement>,
    registrationPages: Record<string, RefObject<HTMLDivElement>>
    setNewUser: React.Dispatch<React.SetStateAction<RegistrationObjectType>>
}


function PersonalDetailsForm({ componentRef, registrationPages, setNewUser}: PersonalDetailsProps){
  
    function handleSubmit(values: { 
      firstName: string,
      otherNames: string,
      lastName: string,  
      gender: string,
    }){
        
        setNewUser((prev) => {
            return ({
                ...prev,
                firstName: values.firstName,
                otherNames: values.otherNames,
                lastName: values.lastName,
                gender: values.gender as "Male" | "Female",
            })
        })
        fadeParentAndReplacePage(registrationPages.parent, componentRef, registrationPages['contact-details'], 'flex')
    }
  
  
    
    const registrationInitialValues = {
      firstName: "",
      otherNames: "",
      lastName: "",
      gender: "",
    }
  
    const registrationValidationSchema = Yup.object({
          firstName: Yup.string().required("Please enter your first name").min(2, "First name is too short").max(40, "First name is too long"),
          otherNames: Yup.string().min(2, "Other names value is too short").max(40, "Other names value is too long"),
          lastName: Yup.string().required("Please enter your last name").min(2, "Last name is too short").max(40, "Last name is too long"),
          gender: Yup.string().required("Please select a gender").oneOf(["Male", "Female"]),
       })
  
    return (
        <>
            <div ref={componentRef}  className='flex flex-col gap-4 sm:justify-between'>
                <Formik
                initialValues={registrationInitialValues}
                validationSchema={registrationValidationSchema}
                onSubmit={handleSubmit}
                validateOnBlur
                resetForm
                >
                    <Form className='flex flex-col gap-4 xl:gap-6'>
                        <div className='my-1 md:my-3'>
                            <h1 className='text-blue-950 mb-2'>Register as a student</h1>
                            <p>Please enter your personal details</p>
                        </div>
                        <div className='w-full flex flex-col sm:flex-row gap-4'>
                            <Input className='w-full' id='f' name='firstName' type='text' label='First Name'  placeholder="Kwabena" hasValidation />
                            <Input className='w-full' id='o' name='otherNames' type='text' label='Other Names'  placeholder="Christian" hasValidation />
                        </div>
                        <Input id='l' name='lastName' type='text' label='Last Name' placeholder="Owusu-Darko" hasValidation />
                        <SelectInput
                            name='gender'
                            label='Gender'
                            options={[
                                {
                                    label: '---  Select a Gender ---',
                                    value: "",
                                },
                                {
                                    label: 'Male',
                                    value: 'Male'
                                },
                                {
                                    label: 'Female',
                                    value: 'Female'
                                }
                            ]}
                            hasValidation
                         />
                        <Button
                            variant='primary'
                            type='submit'
                            className='mt-2'
                        >Continue</Button>
                        <Link to='/login' search={{destination: '/'}} className='m-auto flex gap-1 justify-between'>
                            <p className='text-blue-700 underline-offset-2 text-right underline cursor-pointer' >Already have an account?</p>
                        </Link>
                    </Form>
                </Formik>
            </div>
        </>
    )
}


type ContactDetailsProps = {
    componentRef: RefObject<HTMLDivElement>,
    registrationPages: Record<string, RefObject<HTMLDivElement>>
    setNewUser: React.Dispatch<React.SetStateAction<RegistrationObjectType>>
}

function ContactDetailsForm({ componentRef, registrationPages, setNewUser}: ContactDetailsProps){
  
    function handleSubmit(values: { 
        email: string,
        phone: string,
    }){
        
        setNewUser((prev) => {
            return ({
                ...prev,
                email: values.email,
                phone: values.phone
            })
        })
        fadeParentAndReplacePage(registrationPages.parent, componentRef, registrationPages['course-details'], 'flex')
    }
  

    const registrationInitialValues = {
        email: "",
        phone: "",
    }
  
    const registrationValidationSchema = Yup.object({  
        email: Yup.string().email('Please enter a valid email.')
            .matches(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/, "Please enter a valid email address")
            .required("Please enter your email address").min(2, "Email address is too short").max(50, "Email address is too long"),
        phone: Yup.string()
            .required("Please enter your phone number")
            .min(10, "Phone number must be 10 digits")
            .max(10, "Phone number must be 10 digits")
            .matches(/^[0-9]*$/, "Please enter a valid phone number"),

       })
  
    return (
        <>
            <div ref={componentRef}  className='hidden flex-col gap-4 sm:justify-between'>
                <Formik
                initialValues={registrationInitialValues}
                validationSchema={registrationValidationSchema}
                onSubmit={handleSubmit}
                validateOnBlur
                resetForm
                >
                    <Form className='flex flex-col gap-4 xl:gap-6'>
                        <h1 className='text-blue-950 my-1 md:my-3'>Enter your contact details</h1>
                        <Input id='email' name='email' type='text' label='Email Address' iconType='email'  placeholder="kwabena@kodditor.co" hasValidation />
                        <Input id='p' name='phone' type='text' label='Phone Number' iconType='phone'  placeholder="0201234567" hasValidation />
                        <Button
                            variant='primary'
                            type='submit'
                            className='mt-2'
                        >Continue</Button>
                        <div className='m-auto flex gap-1 justify-between'>
                            <p className='text-blue-700 underline-offset-2 text-right underline cursor-pointer' onClick={() => { fadeParentAndReplacePage(registrationPages['parent'], componentRef, registrationPages['personal-details'], 'flex') }}>Back</p>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    )
}

type CourseDetailsProps = {
    componentRef: RefObject<HTMLDivElement>,
    registrationPages: Record<string, RefObject<HTMLDivElement>>
    setNewUser: React.Dispatch<React.SetStateAction<RegistrationObjectType>>
}


function CourseDetailsForm({ componentRef, registrationPages, setNewUser}: CourseDetailsProps){
        
    const initialCoursesValuesKeys = Object.keys(constants.courses)
    const initialCoursesValues: Record<string, boolean> = {}
    
    for(let key of initialCoursesValuesKeys){initialCoursesValues[key] = false}
    const [ courses, setCourses] = useState<Record<string,boolean>>(initialCoursesValues)

    function handleSubmit(values: { 
      modeOfClass: string,
    }){ 
        setNewUser((prev) => {
            return ({
                ...prev,
                modeOfClass: values.modeOfClass,
                courses: Object.keys(courses).filter( course => courses[course])
            })
        })
        fadeParentAndReplacePage(registrationPages.parent, componentRef, registrationPages['summary-details'], 'flex')
    }
    
    const registrationInitialValues = {
        modeOfClass: "In-Person",
    }
  
    const registrationValidationSchema = Yup.object({
        modeOfClass: Yup.string().oneOf(["In-Person", "Online"]),
       })
  
    return (
        <>
            <div ref={componentRef}  className='hidden flex-col gap-4 sm:justify-between'>
                <Formik
                initialValues={registrationInitialValues}
                validationSchema={registrationValidationSchema}
                onSubmit={handleSubmit}
                validateOnBlur
                resetForm
                >
                    <Form className='flex flex-col gap-4 xl:gap-6'>
                        <div className='my-1 md:my-3'>
                            <h1 className='text-blue-950 mb-2'>Choose your Courses</h1>
                            <p>Please select the courses you want to register for.</p>
                        </div>
                        <div className='w-full flex flex-col sm:flex-row gap-4'>
                            <div className='flex gap-4 flex-wrap'>
                                { 
                                    Object.keys(courses).map((course, idx) => {
                                    return <span 
                                        key={idx} 
                                        className={`px-4 py-2 ${ courses[course] ? 'bg-blue-600 text-white' : 'bg-slate-100 text-blue-600' } cursor-pointer rounded-full text-xl duration-150`}
                                        onClick={()=> {
                                            setCourses((prev) => {
                                                return {
                                                ...prev,
                                                [course]: !prev[course]
                                                }
                                            });
                                        }}
                                    >{course}</span>
                                    
                                })}
                            </div>
                        </div>
                        <SelectInput
                            name='modeOfClass'
                            label='Mode of Class'
                            options={[
                                {
                                    label: '---  Select a class mode ---',
                                    value: "",
                                },
                                {
                                    label: 'In Person',
                                    value: 'In-Person'
                                },
                                {
                                    label: 'Online',
                                    value: 'Online'
                                }
                            ]}
                            hasValidation
                         />
                        <Button
                            variant='primary'
                            type='submit'
                            className='mt-2'
                        >Continue</Button>
                        <div className='m-auto flex gap-1 justify-between'>
                            <p className='text-blue-700 underline-offset-2 text-right underline cursor-pointer' onClick={() => { fadeParentAndReplacePage(registrationPages['parent'], componentRef, registrationPages['contact-details'], 'flex') }}>Back</p>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    )
}


type SummaryDetailsProps = {
    componentRef: RefObject<HTMLDivElement>,
    registrationPages: Record<string, RefObject<HTMLDivElement>>
    newUser: RegistrationObjectType,
    setNewUser: React.Dispatch<React.SetStateAction<RegistrationObjectType>>
}


function SummaryDetailsForm({ componentRef, registrationPages, newUser, setNewUser }: SummaryDetailsProps){
    
    const { isLoading, toggleLoading, resetLoading } = useLoading()

    function handleConfirm(){
        toggleLoading()
 
        makeUnauthenticatedRequest(
            'post', 
            '/api/v1/registrations',
            {
                ...newUser,
                authToken: _getToken()
            }
        )
        .then( res => {
            if(res.data.success){
              toggleLoading()
              setNewUser((prev) => {
                return ({
                    ...prev,
                    code: res.data.data.code,
                })
              })
              fadeParentAndReplacePage(registrationPages.parent, componentRef, registrationPages['registration-complete'], 'grid')
            } else {
                toast.error(res.data.error.msg)
                toggleLoading()
            }
        })
        .catch( err => {
            toast.error(err)
            toggleLoading()
        })
    }
    
    return (
        <>
            <div ref={componentRef}  className='hidden flex-col gap-4 sm:justify-between'>        
                <div className='my-1 md:my-3'>
                    <h1 className='text-blue-950 mb-2'>Registration Summary</h1>
                    <p>Please confirm your registration details.</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <p className='text-lg inline font-medium'>Full Name:</p>
                        <p className='text-lg text-blue-600 inline'>{newUser.firstName}{newUser.otherNames == "" ? " " : " " + newUser.otherNames + " "}{newUser.lastName}</p>
                    </div>
                    <div className='flex gap-2'>
                        <p className='text-lg inline font-medium'>Gender:</p>
                        <p className='text-lg text-blue-600 inline'>{newUser.gender}</p>
                    </div>
                    <div className='flex gap-2'>
                        <p className='text-lg inline font-medium'>Email Address:</p>
                        <p className='text-lg text-blue-600 inline'>{newUser.email}</p>
                    </div>
                    <div className='flex gap-2'>
                        <p className='text-lg inline font-medium'>Phone Number:</p>
                        <p className='text-lg text-blue-600 inline'>{newUser.phone}</p>
                    </div>
                    <div className='flex gap-2'>
                        <p className='text-lg inline font-medium'>Mode of Class:</p>
                        <p className='text-lg text-blue-600 inline'>{newUser.modeOfClass}</p>
                    </div>
                    <div className='flex gap-2'>
                        <p className='text-lg inline font-medium'>Courses:</p>
                        <p className='text-lg text-blue-600 inline'>{newUser.courses.join(', ')}</p>
                    </div>
                </div>
                <Button
                    variant='primary'
                    type='submit'
                    isLoading={isLoading}
                    onClick={handleConfirm}
                    className='mt-2'
                >Continue</Button>
                <div className='m-auto flex gap-1 justify-between'>
                    <p className='text-blue-700 underline-offset-2 text-right underline cursor-pointer' onClick={() => { fadeParentAndReplacePage(registrationPages['parent'], componentRef, registrationPages['course-details'], 'flex') }}>Back</p>
                </div>
            </div>
        </>
    )
}

type SummaryConfirmationProps = {
    componentRef: RefObject<HTMLDivElement>,
    newUser: RegistrationObjectType
}

function SummaryConfirmationForm({ componentRef, newUser}: SummaryConfirmationProps){
    
    return (
        <>
            <div ref={componentRef}  className='hidden w-full h-full place-items-center my-auto'>        
                <div className='my-1 md:my-3'>
                    <h1 className='text-blue-950 mb-2'>You've registered, {newUser.firstName}!</h1>
                    <p className='mt-4 text-lg'>Your registration application has been submitted successfully.
                        We'll reach out to you via email with next steps once your application has been accepted.
                    </p>
                    <p className='my-3 text-lg font-semibold'>Registration code: {newUser.code}</p>
                </div>
                
            </div>
        </>
    )
}