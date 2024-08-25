import { Link, createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { _getToken, _setTokenExpiration, _setUser } from '@repo/utils';
import { Input, Button } from '@repo/ui'
import {  Form, Formik } from 'formik'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
import { _setToken, fadeParentAndReplacePage, makeUnauthenticatedRequest, useLoading } from '@repo/utils'
import { RefObject, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useLMSContext } from '../app'
import { IUserDoc } from '@repo/models'
import { HydratedDocument } from 'mongoose'
import OtpInput from 'react-otp-input'
import dayjs from 'dayjs';
YupPassword(Yup);


export const Route = createLazyFileRoute('/login')({
  component: () => <LoginPage />
})


function LoginPage(){

  const parentRef = useRef<HTMLDivElement>(null)
  const loginRef = useRef<HTMLDivElement>(null)
  const forgotRef = useRef<HTMLDivElement>(null)
  const forgotVerificationRef = useRef<HTMLDivElement>(null)
  const forgotNewPasswordRef = useRef<HTMLDivElement>(null)

  const searchParams = Route.useSearch()


  const pages: Record<string, RefObject<HTMLDivElement>> = {
      parent: parentRef,
      login: loginRef,
      forgot: forgotRef,
      'forgot-verification': forgotVerificationRef,
      'forgot-new-password':forgotNewPasswordRef,
  
  }

  return (
      <>
          <main className="w-full min-h-screen max-h-screen sm:max-h-max overflow-y-hidden sm:overflow-y-auto overflow-x-hidden bg-blue-50 sm:grid place-items-center">
              <div className="flex flex-col items-center">
                  <img className='my-4  sm:my-8 h-12' src="/img/timeline-logo.png" />
                  <div className='flex w-full h-[90vh] sm:w-[80%] sm:h-fit sm:min-h-[400px] xl:w-[1000px] bg-white rounded shadow overflow-hidden'>
                      <div className='w-1/2 hidden sm:block'>
                          <img className='object-cover h-full' src="/img/login-student-image.jpg" />
                      </div>
                      <div ref={parentRef} className='w-full sm:w-1/2  p-8'>
                        <Login
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
                          <div className='absolute flex sm:hidden bottom-10 flex-col items-center w-[calc(100vw-4rem)] m-auto text-blue-600'>
                              <p className='text-center'>&copy; {new Date().getFullYear()} Timeline Trust. All Rights Reserved.</p>
                              <p>Powered By <a>Innovaten</a></p>
                          </div>
                      </div>
                  </div>
                    <div className=' hidden sm:flex bottom-10 flex-col items-center gap-2 w-[calc(100vw-8rem)] m-auto mt-6 mb-4 text-blue-600'>
                        <p className='text-center'>&copy; {new Date().getFullYear()} Timeline Trust. All Rights Reserved.</p>
                        <p className='text-center'>Powered By <a>Innovaten</a></p>
                    </div>
              </div>
          </main>
      </>
  )
}

type LoginProps = {
  componentRef: RefObject<HTMLDivElement>
  pages: Record<string, RefObject<HTMLDivElement>>,
}

function Login({ componentRef, pages }: LoginProps){

  const { isLoading, toggleLoading, resetLoading } = useLoading()
  const router = useRouter()

  const setUser = useLMSContext((state) => state.setUser )

  const searchParams = Route.useSearch()

  function handleSubmit(values: { email: string, password: string}){
      toggleLoading()
 
      makeUnauthenticatedRequest(
          'post', 
          '/api/v1/auth/login',
          values,
      )
      .then(res => {
            if(res.data.success){
              const user = res.data.data.user;
              const token = res.data.data.access_token;

              if(user.meta.isPasswordSet){
                _setToken(token);
                _setUser(user)
                setUser(user);

                _setTokenExpiration(dayjs(user.meta.tokenGeneratedAt).add(3, 'hours').toISOString())

                router.navigate({ 
                    ...( searchParams.destination == '' ?  {to: '/' } : { to: searchParams.destination })
                    })
                return
              }
              // User has not set their password

              // Automatically send OTP
              makeUnauthenticatedRequest(
                "get",
                `/api/v1/auth/otp/send?email=${encodeURIComponent(user.email)}`
            )
            .then(res => {
                if(res.data.success){
                    sessionStorage.setItem('e', user.email)
                    fadeParentAndReplacePage(pages['parent'], pages['login'], pages['forgot-verification'], 'flex')

                } else {
                    toast.error(`${res.data.error.msg ?? "We encountered an issue while sending you an OTP. Please try again later"}`);
                }
            })
            .catch( err => {
                    toast.error(`${err.message ? err.message : err}`)
            })
          } else {
              toast.error(`${res.data.error.msg}`)
          }
      })
      .catch( err => {
          toast.error(`${err}`)
        })
    .finally(() => {
        resetLoading()
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
                  <Form className='flex flex-col gap-6'>
                      <h1 className='text-blue-950'>Login</h1>
                      <Input id='email' name='email' type='email' iconType='email' label='Email Address'  placeholder="kwabena@kodditor.com" hasValidation />
                      <Input id='p' name='password' type='password' iconType='password' label='Password' placeholder="********" hasValidation />
                      <div className='hidden sm:flex gap-1 justify-between w-full'>
                          <Link to='/register' className='text-blue-700 underline-offset-2 underline cursor-pointer' >Create an account</Link>
                          <p className='text-blue-700 underline-offset-2 text-right underline cursor-pointer' onClick={() => { fadeParentAndReplacePage(pages['parent'], componentRef, pages['forgot'], 'flex') }}>Update Password</p>
                      </div>
                      <Button
                          variant='primary'
                          isLoading={isLoading}
                          type='submit'
                      >Login</Button>
                      <div className='sm:hidden flex items-center gap-1 justify-between w-full'>
                          <Link to='/register'  className='text-blue-700 underline-offset-2 underline cursor-pointer' >Register an account</Link>
                          <p className='text-blue-700 underline-offset-2 text-right cursor-pointer underline' onClick={() => { fadeParentAndReplacePage(pages['parent'], componentRef, pages['forgot'], 'flex') }}>Update Password</p>
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
      toggleLoading()
      makeUnauthenticatedRequest('get', `/api/v1/auth/otp/send?email=${encodeURIComponent(values.email)}&via=email`)
      .then( res => {
          if(res.data.success){
              sessionStorage.setItem('e', values.email);
              fadeParentAndReplacePage(pages['parent'], pages['forgot'], pages['forgot-verification'], 'flex')
          } else {
              toast.error(`${res.data.error.msg}`)
          }
          toggleLoading()

      }).catch(err => {
          toast.error(`${err}`)
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
                  <Form className='flex flex-col gap-6'>
                      <div className=''>
                          <h1 className='text-blue-950 mb-3'>Enter your email address</h1>
                          <p>We'll send you a One Time Password (OTP)</p>
                      </div>
                      <Input id='e' name='email' type='email' label='Email Address' iconType='email'  placeholder="kwabena@example.com" hasValidation />
                      <div className='hidden sm:flex justify-end w-full'>
                          <p className='text-blue-700 underline-offset-2 cursor-pointer underline' onClick={() => { fadeParentAndReplacePage(pages['parent'], componentRef, pages['login'], 'flex') }}>Already have an account?</p>
                      </div>
                      <Button
                          variant='primary'
                          isLoading={isLoading}
                          type='submit'
                      >Send OTP</Button>
                      <div className='sm:hidden flex justify-center w-full'>
                          <p className='text-blue-700 underline-offset-2 cursor-pointer underline' onClick={() => { fadeParentAndReplacePage(pages['parent'], componentRef, pages['login'], 'flex') }}>Already have an account?</p>
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

      makeUnauthenticatedRequest('get', `/api/v1/auth/otp/verify?email=${encodeURIComponent(email ?? "")}&otp=${OTP}`)
      .then( res => {
          if(res.data.success){
              sessionStorage.setItem('o', OTP);
              fadeParentAndReplacePage(pages['parent'], pages['forgot-verification'], pages['forgot-new-password'], 'flex')
          } else {
              toast.error(`${res.data.error.msg}`)
          }
          toggleLoading()

      }).catch(err => {
          toast.error(`${err}`)
          setOTPHasError(true)
          toggleLoading()
      })
  }

  function handleReset(){
      resetLoading();
  }

  return (
      <>
          <div ref={componentRef}  className='hidden flex-col gap-4 sm:justify-between'>
                  <form onSubmit={handleSubmit} onReset={handleReset} className='flex flex-col gap-6'>
                      <div>
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
                      >Verify OTP</Button>
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

      makeUnauthenticatedRequest(
          'patch', 
          '/api/v1/users/update-password',
          {
              email: `${sessionStorage.getItem('e') ?? ""}`,
              newPassword: values.newPassword,
              ...( sessionStorage.getItem('o') ? {'otp':`${sessionStorage.getItem('o')}` } : {}),
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
              toast.error(`${res.data.error.msg}`)
              toggleLoading()
          }
      })
      .catch( err => {
          toast.error(`${err}`)
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
                  <Form className='flex flex-col gap-6'>
                      <h1 className='text-blue-950'>Update Your Password</h1>
                      <Input name='newPassword' type='password' label='New Password' iconType='password' placeholder="********" hasValidation />
                      <Input name='confirmPassword' type='password' label='Confirm Password' iconType='password' placeholder="********" hasValidation />
                      <Button
                          variant='primary'
                          isLoading={isLoading}
                          type='submit'
                      >Update your password</Button>
                  </Form>
              </Formik>
          </div>
      </>
  )
}
