import { Navigate, createLazyFileRoute, useSearch } from '@tanstack/react-router'
import { _getToken } from '@repo/utils';
import { Input, Button } from '@repo/ui'
import { ErrorMessage, Form, Formik } from 'formik'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
import { _setToken, fadeParentAndReplacePage, makeUnauthenticatedRequest, useLoading } from '@repo/utils'
import React, { RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useLMSContext } from '../main'
import { HydratedDocument } from 'mongoose'
import { IUserDoc } from '@repo/models'
import { useRouter } from '@tanstack/react-router'
import OtpInput from 'react-otp-input';
import { constants } from '@repo/config'
import { SelectInput } from '../../../../packages/ui/src/components/forms';

YupPassword(Yup);

export const Route = createLazyFileRoute('/')({
  component: IndexRoute
})


function IndexRoute({}){
  const authToken = _getToken();

  if(authToken){
      Navigate({ to: "/", search: { register: false, destination: ''} });
  } else {
    return <IndexPage />
  }
}


export default function IndexPage(){

    const parentRef = useRef<HTMLDivElement>(null)
    const loginRef = useRef<HTMLDivElement>(null)
    const forgotRef = useRef<HTMLDivElement>(null)
    const forgotVerificationRef = useRef<HTMLDivElement>(null)
    const forgotNewPasswordRef = useRef<HTMLDivElement>(null)
    const registerRef = useRef<HTMLDivElement>(null)

    const searchParams = Route.useSearch()
    const [ isRegistering, setIsRegistering ] = useState<boolean>(searchParams.register)


    const pages: Record<string, RefObject<HTMLDivElement>> = {
        parent: parentRef,
        login: loginRef,
        forgot: forgotRef,
        'forgot-verification': forgotVerificationRef,
        'forgot-new-password':forgotNewPasswordRef,
        register: registerRef,
    
    }

    return (
        <>
            <main className="w-screen min-h-screen bg-blue-50 md:p-8 2xl:p-12 ">
                <div className="flex flex-col items-center">
                    <img className='my-4 sm:my-8 xl:my-16' src="/img/timeline-logo.png" />
                    <div className='flex w-full h-[90vh] sm:w-[80%] sm:h-fit sm:min-h-[400px] xl:w-[1000px] 2xl:w-[1100px] bg-white rounded shadow overflow-hidden'>
                        <div className='w-1/2 hidden sm:block'>
                            <img className='object-cover h-full' src="/img/login-student-image.jpg" />
                        </div>
                        <div ref={parentRef} className='w-full sm:w-1/2  p-8'>
                            {
                                !isRegistering && 
                                <>
                                     <Login
                                        setIsRegistering={setIsRegistering}
                                        componentRef={pages['login']}  
                                        pages={pages}
                                    />
                                    <ForgotPassword
                                        componentRef={pages['forgot']}  
                                        pages={pages}
                                    />
                                    <ForgotVerification
                                        componentRef={pages['forgot-verification']}  
                                        pages={pages}
                                    />
                                    <ForgotNewPassword
                                        componentRef={pages['forgot-new-password']}  
                                        pages={pages}
                                    />
                                </>
                            }
                           {

                                isRegistering && 
                                <>
                                    <Register
                                        setIsRegistering={setIsRegistering}
                                        componentRef={pages['register']}  
                                        pages={pages}
                                    />
                                </>

                           }
                            <div className='absolute flex sm:hidden bottom-10 flex-col items-center w-[calc(100vw-4rem)] m-auto text-blue-600'>
                                <p className='text-center'>&copy; {new Date().getFullYear()} Timeline Trust. All Rights Reserved.</p>
                                <p>Powered By <a>Innovaten</a></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' hidden sm:flex bottom-10 flex-col items-center gap-2 w-[calc(100vw-8rem)] m-auto mt-8 text-blue-600'>
                    <p className='text-center'>&copy; {new Date().getFullYear()} Timeline Trust. All Rights Reserved.</p>
                    <p className='text-center'>Powered By <a>Innovaten</a></p>
                </div>
            </main>
        </>
    )
}

type LoginProps = {
    componentRef: RefObject<HTMLDivElement>
    pages: Record<string, RefObject<HTMLDivElement>>,
    setIsRegistering: React.Dispatch<SetStateAction<boolean>>
}

function Login({ componentRef, pages, setIsRegistering }: LoginProps){

    const { isLoading, toggleLoading, resetLoading } = useLoading()
    const router = useRouter()

    const setToken = useLMSContext((state) => state.setToken )
    const setUser = useLMSContext((state) => state.setUser )

    const searchParams = Route.useSearch()

    function handleSubmit(values: { email: string, password: string}){
        toggleLoading()
   
        makeUnauthenticatedRequest(
            'post', 
            '/api/auth/login',
            values,
        )
        .then( res => {
            if( res.data.status == 200){
                const token = res.data.data.token;
                _setToken(token);
                setToken(token);
                
                const user: HydratedDocument<IUserDoc> = res.data.user;
                setUser(user);
                router.navigate({ 
                  ...( searchParams.destination == '' ?  {to: '/home' } : { to: searchParams.destination })
                  })
                toggleLoading()
            } else {
                toast.error(res.data.error.message)
                toggleLoading()
            }
        })
        .catch( err => {
            toast.error(err)
            toggleLoading()
        })
    }

    function handleReset(){
        resetLoading();
    }

    
    const loginInitialValues = {
        email: "",
        password: ""
    }

    const loginValidationSchema = Yup.object({
        email: Yup.string()
            .email("Please enter a valid email")
            .required('Please enter your email address')
            .matches(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/)
            .min(4, 'Email is too short')
            .max(64, "Email is too long"),
        password: Yup.string()
            .required('Please enter a password')
            .min(8, 'Password must have at least 8 characters')
            .max(100, 'Password must have less than 100 characters')
            .minLowercase(1, 'Password must contain at least one lowercase letter')
            .minUppercase(1, 'Password must contain at least one uppercase letter')
            .minNumbers(1, 'Password must contain at least one number')
            .minSymbols(1, 'Password must contain at least one symbol')
    })

    return (
        <>
            <div ref={componentRef}  className='flex flex-col gap-4 sm:justify-between'>
                <Formik
                initialValues={loginInitialValues}
                validationSchema={loginValidationSchema}
                onSubmit={handleSubmit}
                onReset={handleReset}
                validateOnBlur
                resetForm
                >
                    <Form className='flex flex-col gap-4 xl:gap-6'>
                        <h1 className='text-blue-950 my-1 md:my-3'>Login</h1>
                        <Input id='e' name='email' type='email' iconType='email' label='Email Address'  placeholder="kwabena@kodditor.com" hasValidation />
                        <Input id='p' name='password' type='password' iconType='password' label='Password' placeholder="********" hasValidation />
                        <div className='hidden sm:flex gap-1 justify-between w-full'>
                            <p className='text-blue-700 underline-offset-2 underline cursor-pointer' onClick={() => { fadeParentAndReplacePage(pages['parent'], componentRef, pages['register'], 'flex'); setTimeout(() => setIsRegistering(true), 250) }}>Register an account</p>
                            <p className='text-blue-700 underline-offset-2 text-right underline cursor-pointer' onClick={() => { fadeParentAndReplacePage(pages['parent'], componentRef, pages['forgot'], 'flex') }}>Forgot your password?</p>
                        </div>
                        <Button
                            variant='primary'
                            isLoading={isLoading}
                            type='submit'
                            className='mt-2'
                        >Login</Button>
                        <div className='sm:hidden flex items-center gap-1 justify-between w-full'>
                            <p className='text-blue-700 underline-offset-2 underline cursor-pointer' onClick={() => { fadeParentAndReplacePage(pages['parent'], componentRef, pages['register'], 'flex'); setTimeout(() => setIsRegistering(true), 250) }}>Register an account</p>
                            <p className='text-blue-700 underline-offset-2 text-right cursor-pointer underline' onClick={() => { fadeParentAndReplacePage(pages['parent'], componentRef, pages['forgot'], 'flex') }}>Forgot your password?</p>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    )

}


type ForgotProps = {
    componentRef: RefObject<HTMLDivElement>
    pages: Record<string, RefObject<HTMLDivElement>>
}


function ForgotPassword({ componentRef, pages }: ForgotProps){

    const { isLoading, toggleLoading, resetLoading } = useLoading()

    function handleSubmit(values: { email: string }){
        fadeParentAndReplacePage(pages['parent'], pages['forgot'], pages['forgot-verification'], 'flex')
        return
        makeUnauthenticatedRequest('get', `/api/auth/forgot-password?email=${values.email}`)
        .then( res => {
            if(res.data.status == 200){
                sessionStorage.setItem('e', values.email);
                fadeParentAndReplacePage(pages['parent'], pages['forgot'], pages['forgot-verification'], 'flex')
            } else {
                toast.error(res.data.error.message)
            }
            toggleLoading()

        }).catch(err => {
            toast.error(err)
            toggleLoading()
        })
    }

    function handleReset(){
        resetLoading();
    }

    const forgotInitialValues = {
        email: ""
    }

    const forgotValidationSchema = Yup.object({
        email: Yup.string()
            .email("Please enter a valid email")
            .required('Please enter your email address')
            .matches(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/)
            .min(4, 'Email is too short')
            .max(64, "Email is too long")
    })

    return (
        <>
            <div ref={componentRef}  className='hidden flex-col gap-4 sm:justify-between'>
                <Formik
                initialValues={forgotInitialValues}
                validationSchema={forgotValidationSchema}
                onSubmit={handleSubmit}
                onReset={handleReset}
                validateOnBlur
                resetForm
                >
                    <Form className='flex flex-col gap-4 sm:gap-6'>
                        <div className='my-3'>
                            <h1 className='text-blue-950 mb-3'>Forgot Your Password?</h1>
                            <p>We'll send you a One Time Password (OTP)</p>
                        </div>
                        <Input id='e' name='email' type='email' label='Email Address' iconType='email'  placeholder="kwabena@example.com" hasValidation />
                        <div className='hidden sm:flex justify-end w-full'>
                            <p className='text-blue-700 underline-offset-2 cursor-pointer underline' onClick={() => { fadeParentAndReplacePage(pages['parent'], componentRef, pages['login'], 'flex') }}>Already have account? Click here to login</p>
                        </div>
                        <Button
                            variant='primary'
                            isLoading={isLoading}
                            type='submit'
                            className='mt-8 sm:mt-2'
                        >Send OTP</Button>
                        <div className='sm:hidden flex justify-center w-full'>
                            <p className='text-blue-700 underline-offset-2 cursor-pointer underline' onClick={() => { fadeParentAndReplacePage(pages['parent'], componentRef, pages['login'], 'flex') }}>Already have account? Click here to login</p>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    )
}

type ForgotVerificationProps = {
    componentRef: RefObject<HTMLDivElement>
    pages: Record<string, RefObject<HTMLDivElement>>
}


function ForgotVerification({componentRef, pages}: ForgotVerificationProps){

    const { isLoading, toggleLoading, resetLoading } = useLoading()
    const [ OTP, setOTP ] = useState<string>('')
    const [ OTPHasError, setOTPHasError ] = useState<boolean>(false)
    const email = sessionStorage.getItem('e')


    function handleSubmit(e: any){
        e.preventDefault();
        toggleLoading()

        if(OTP.length !== 6) {
            toggleLoading()
            setOTPHasError(true)
            return;
        } 

        setOTPHasError(false)
        fadeParentAndReplacePage(pages['parent'], pages['forgot-verification'], pages['forgot-new-password'], 'flex')
        return 

        makeUnauthenticatedRequest('get', `/api/auth/verify-otp?email=${email}&otp=${OTP}`)
        .then( res => {
            if(res.data.success){
                sessionStorage.setItem('o', OTP);
                fadeParentAndReplacePage(pages['parent'], pages['forgot'], pages['forgot-new-password'], 'flex')
            } else {
                toast.error(res.data.error.message)
            }
            toggleLoading()

        }).catch(err => {
            toast.error(err)
            setOTPHasError(false)
            toggleLoading()
        })
    }

    function handleReset(){
        resetLoading();
    }

    return (
        <>
            <div ref={componentRef}  className='hidden flex-col gap-4 sm:justify-between'>
                    <form onSubmit={handleSubmit} onReset={handleReset} className='flex flex-col gap-4 sm:gap-6'>
                        <div className='my-3'>
                            <h1 className='text-blue-950 mb-3'>Enter your OTP.</h1>
                            <p>Please check your email.</p>
                        </div>
                        <div className='flex justify-center'>
                            <OtpInput
                                value={OTP}
                                onChange={setOTP}
                                numInputs={6}
                                renderSeparator={<span className='px-2'></span>}
                                renderInput={(props) => (
                                <input 
                                {...props}
                                    className='p-1 sm:p-2 rounded !w-[calc(15%)] aspect-[0.8] text-3xl sm:!text-4xl border-2 outline-none focus:ring-0 focus:border-blue-400 border-slate-300' 
                                />)}
                            />
                        </div>
                        <p className={`${OTPHasError ? 'block' : 'hidden'} w-full text-center text-red-400`}>Please enter a valid OTP</p>
                        <Button
                            variant='primary'
                            isLoading={isLoading}
                            type='submit'
                            className='mt-8 sm:mt-2'
                        >Send OTP</Button>
                    </form>
            </div>
        </>
    )



}

type ForgotNewPasswordProps = {
    componentRef: RefObject<HTMLDivElement>
    pages: Record<string, RefObject<HTMLDivElement>>
}

function ForgotNewPassword({componentRef, pages}: ForgotNewPasswordProps){

    const { isLoading, toggleLoading, resetLoading } = useLoading()
    const router = useRouter()
    const searchParams = Route.useSearch()

    function handleSubmit(values: { newPassword: string, confirmPassword: string}){
        toggleLoading()
        setTimeout(() => router.navigate({ to: '/', search: {destination: searchParams.destination, register: false }}), 1000)
        return
        makeUnauthenticatedRequest(
            'post', 
            '/api/auth/update-password',
            {
                email: `${sessionStorage.getItem('e')}`,
                newPassword: values.newPassword,
                ...( sessionStorage.getItem('o') ? {'otp-code':`${sessionStorage.getItem('o')}` } : {}),
            },
        )
        .then( res => {
            if( res.data.success){
                toast.success('Updated your password successfully')
                setTimeout(() => router.navigate({ 
                  to: `/`,
                  search: {
                    destination: searchParams.destination,
                    register: false
                  }
                }), 1000)
                toggleLoading()
            } else {
                toast.error(res.data.error.message)
                toggleLoading()
            }
        })
        .catch( err => {
            toast.error(err)
            toggleLoading()
        })
    }

    function handleReset(){
        resetLoading();
    }

    const newPasswordInitialValues = {
        newPassword: "",
        confirmPassword: "",
    }

    const newPasswordValidationSchema = Yup.object({
        newPassword: Yup.string()
            .required('Please enter a new password')
            .min(8, 'Password must have at least 8 characters')
            .max(100, 'Password must have less than 100 characters')
            .minLowercase(1, 'Password must contain at least one lowercase letter')
            .minUppercase(1, 'Password must contain at least one uppercase letter')
            .minNumbers(1, 'Password must contain at least one number')
            .minSymbols(1, 'Password must contain at least one symbol'),
        confirmPassword: Yup.string()
            .test('passwords-match', 'Passwords must match', function(value){
                return this.parent.newPassword === value
            })
    })

    return (
        <>
            <div ref={componentRef}  className='hidden flex-col gap-4 sm:justify-between'>
                <Formik
                initialValues={newPasswordInitialValues}
                validationSchema={newPasswordValidationSchema}
                onSubmit={handleSubmit}
                onReset={handleReset}
                validateOnBlur
                resetForm
                >
                    <Form className='flex flex-col gap-4 sm:gap-6'>
                        <h1 className='text-blue-950 my-3'>Update Your Password</h1>
                        <Input id='p1' name='newPassword' type='password' label='New Password' iconType='password' placeholder="********" hasValidation />
                        <Input id='p2' name='confirmPassword' type='password' label='Password' iconType='password' placeholder="********" hasValidation />
                        <Button
                            variant='primary'
                            isLoading={isLoading}
                            type='submit'
                            className='mt-2'
                        >Update your password</Button>
                    </Form>
                </Formik>
            </div>
        </>
    )
}


type RegisterProps = {
  componentRef: RefObject<HTMLDivElement>
  pages: Record<string, RefObject<HTMLDivElement>>
  setIsRegistering: React.Dispatch<SetStateAction<boolean>>
}

type RegistrationObjectType = Pick<IUserDoc,
"firstName" |
"otherNames" |
"lastName" |
"email" |
"phone" |
"hasGhanaCard" |
"ghanaCardFrontImageUrl" |
"ghanaCardBackImageUrl"|
"gender"
> & {
    modeOfClass: string,
    courses: string[]
}

function Register({ componentRef, pages, setIsRegistering }: RegisterProps){

  
  const [ newUser, setNewUser ] = useState<RegistrationObjectType>({
    firstName: "",
    otherNames: "",
    lastName: "",
    
    email: "",
    phone: "",

    gender: "Male",

    hasGhanaCard: true,

    ghanaCardFrontImageUrl: "",
    ghanaCardBackImageUrl: "",

    // @ts-ignore
    modeOfClass: "In-Person",
    courses: []
  }) 

  const personalDetailsRef = useRef<HTMLDivElement>(null)
  const contactDetailsRef = useRef<HTMLDivElement>(null)
  const courseDetailsRef = useRef<HTMLDivElement>(null)
  const summaryDetailsRef = useRef<HTMLDivElement>(null)

  const registrationPages: Record<string, RefObject<HTMLDivElement>> = {
    'parent': componentRef,
    'personal-details': personalDetailsRef,
    'contact-details': contactDetailsRef,
    'course-details': courseDetailsRef,
    'summary-details': summaryDetailsRef,
  }

  return (
      <>
          <div ref={componentRef}  className='flex flex-col gap-4 sm:justify-between'>
              <PersonalDetailsForm
                componentRef={registrationPages['personal-details']}
                registrationPages={registrationPages}
                pages={pages}
                setNewUser={setNewUser} 
                setIsRegistering={setIsRegistering}
              />
              <ContactDetailsForm
                componentRef={registrationPages['contact-details']}
                registrationPages={registrationPages}
                pages={pages}
                setNewUser={setNewUser} 
              />
              <CourseDetailsForm
                componentRef={registrationPages['course-details']}
                registrationPages={registrationPages}
                pages={pages}
                setNewUser={setNewUser} 
              />
              <SummaryDetailsForm
                componentRef={registrationPages['summary-details']}
                registrationPages={registrationPages}
                pages={pages}
                newUser={newUser}
              />
               <SummaryConfirmationForm
                componentRef={registrationPages['registration-complete']}
                newUser={newUser}
              />
          </div>
      </>
  )

}

type PersonalDetailsProps = {
    componentRef: RefObject<HTMLDivElement>,
    pages: Record<string, RefObject<HTMLDivElement>>
    registrationPages: Record<string, RefObject<HTMLDivElement>>
    setNewUser: React.Dispatch<React.SetStateAction<RegistrationObjectType>>
    setIsRegistering: React.Dispatch<SetStateAction<boolean>>
}


function PersonalDetailsForm({ componentRef, pages, registrationPages, setIsRegistering, setNewUser}: PersonalDetailsProps){
  
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
                        <div className='m-auto flex gap-1 justify-between'>
                            <p className='text-blue-700 underline-offset-2 text-right underline cursor-pointer' onClick={() => { fadeParentAndReplacePage(pages['parent'], pages['register'], pages['login'], 'flex'), setTimeout( () => setIsRegistering(false), 250);}}>Already have an account?</p>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    )
}


type ContactDetailsProps = {
    componentRef: RefObject<HTMLDivElement>,
    pages: Record<string, RefObject<HTMLDivElement>>
    registrationPages: Record<string, RefObject<HTMLDivElement>>
    setNewUser: React.Dispatch<React.SetStateAction<RegistrationObjectType>>
}

function ContactDetailsForm({ componentRef, pages, registrationPages, setNewUser}: ContactDetailsProps){
  
    function handleSubmit(values: { 
        email: string,
        phone: string,
        hasGhanaCard: number,
        ghanaCardFrontImageUrl?: string,
        ghanaCardBackImageUrl?: string,
    }){
        
        setNewUser((prev) => {
            return ({
                ...prev,
                email: values.email,
                phone: values.phone,
                hasGhanaCard: values.hasGhanaCard == 1,
                ghanaCardFrontImageUrl: values.ghanaCardFrontImageUrl,
                ghanaCardBackImageUrl: values.ghanaCardBackImageUrl,
            })
        })
        fadeParentAndReplacePage(registrationPages.parent, componentRef, registrationPages['course-details'], 'flex')
    }
  

    const registrationInitialValues = {
        email: "",
        phone: "",
        hasGhanaCard: 0,
        ghanaCardFrontImageUrl: "",
        ghanaCardBackImageUrl: "",
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

        hasGhanaCard: Yup.number().required(),
        ghanaCardFrontImageUrl: 
            Yup.string()
            .when('hasGhanaCard', {
                is: true,
                then: (schema) => schema.required('Please add the front image of your ghana card'), 
            }),
        ghanaCardBackImageUrl: 
            Yup.string()
            .when('hasGhanaCard', {
                is: true,
                then: (schema) => schema.required('Please add the front image of your ghana card'), 
            }),
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
                        <Input id='e' name='email' type='text' label='Email Address' iconType='email'  placeholder="kwabena@kodditor.co" hasValidation />
                        <Input id='p' name='phone' type='text' label='Phone Number' iconType='phone'  placeholder="0201234567" hasValidation />
                        { /* TODO: Add Ghana Cards */}
                        <SelectInput
                            name='hasGhanaCard'
                            label='Do You have a Ghana Card?'
                            options={[
                                {
                                    label: '---  Select an option ---',
                                    value: 0,
                                },
                                {
                                    label: 'Yes',
                                    value: 1
                                },
                                {
                                    label: 'No',
                                    value: 0
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
    pages: Record<string, RefObject<HTMLDivElement>>
    registrationPages: Record<string, RefObject<HTMLDivElement>>
    setNewUser: React.Dispatch<React.SetStateAction<RegistrationObjectType>>
}


function CourseDetailsForm({ componentRef, pages, registrationPages, setNewUser}: CourseDetailsProps){
        
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
                                        className={`px-4 py-2 ${ courses[course] ? 'bg-blue-600 cursor-pointer text-white' : 'bg-slate-100 text-blue-600' } rounded-full text-xl duration-150`}
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
    pages: Record<string, RefObject<HTMLDivElement>>
    registrationPages: Record<string, RefObject<HTMLDivElement>>
    newUser: RegistrationObjectType
}


function SummaryDetailsForm({ componentRef, pages, registrationPages, newUser}: SummaryDetailsProps){
    
    const { isLoading, toggleLoading, resetLoading } = useLoading()

    function handleConfirm(){
        toggleLoading()
 
        makeUnauthenticatedRequest(
            'post', 
            '/api/auth/new-user',
            newUser,
        )
        .then( res => {
            if( res.data.status == 200){
              toggleLoading()
              fadeParentAndReplacePage(registrationPages.parent, componentRef, registrationPages['registration-complete'], 'grid')
            } else {
                toast.error(res.data.error.message)
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
                        <p className='text-lg inline font-medium'>Ghana Card:</p>
                        <p className='text-lg text-blue-600 inline'>{newUser.hasGhanaCard ? "Yes" : "No"}</p>
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
            <div ref={componentRef}  className='w-full h-full hidden place-items-center my-auto'>        
                <div className='my-1 md:my-3'>
                    <h1 className='text-blue-950 mb-2'>You've registered, {newUser.firstName}!</h1>
                    <p className='mt-3 text-lg'>You're registration application has been submitted successfully.
                        We'll reach out to you with next steps once your application has been accepted.
                    </p>
                </div>
                
            </div>
        </>
    )
}