import { Link, createLazyFileRoute, useRouter, useMatches, useRouteContext } from '@tanstack/react-router'
import { _getToken, _setUser } from '@repo/utils';
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

  const pages: Record<string, RefObject<HTMLDivElement>> = {
      parent: parentRef,
      login: loginRef,
      forgot: forgotRef,
      'forgot-verification': forgotVerificationRef,
      'forgot-new-password':forgotNewPasswordRef,
  
  }


  return (
      <>
          <main className="w-screen min-h-screen bg-blue-50 md:p-8 2xl:p-12 ">
              <div className="flex flex-col items-center">
                  <img className='my-4  sm:my-8 h-12' src="/img/timeline-logo.png" />
                  <div className='flex w-full h-[90vh] sm:w-[80%] sm:h-fit sm:min-h-[400px] xl:w-[1000px] 2xl:w-[1100px] bg-white rounded shadow overflow-hidden'>
                      <div className='w-1/2 hidden sm:block'>
                          <img className='object-cover h-full' src="/img/login-teacher-image.jpg" />
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
}

function Login({ componentRef, pages }: LoginProps){

  const { isLoading, toggleLoading, resetLoading } = useLoading()
  const router = useRouter()
  const context = useRouteContext({ from: '/login' })
  const { setUser, user } = useLMSContext()

  function handleSubmit(values: { email: string, password: string}){
      toggleLoading()
 
      makeUnauthenticatedRequest(
          'post', 
          '/api/v1/auth/login',
          values,
      )
      .then(res => {
            if(res.data.success){
              const token = res.data.data.access_token;
              _setToken(token);
              
              const loginUser: HydratedDocument<IUserDoc> = res.data.data.user;
              setUser(loginUser);
              _setUser(loginUser);
              context.user = loginUser;
              
              router.navigate({ 
                to: "/"
              })
              toggleLoading()
          } else {
              toast.error(res.data.error.msg)
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
                      <Input id='email' name='email' type='email' iconType='email' label='Email Address'  placeholder="kwabena@kodditor.com" hasValidation />
                      <Input id='p' name='password' type='password' iconType='password' label='Password' placeholder="********" hasValidation />
                      <div className='hidden sm:flex gap-1 justify-end w-full'>
                          <p className='text-blue-700 underline-offset-2 text-right underline cursor-pointer' onClick={() => { fadeParentAndReplacePage(pages['parent'], componentRef, pages['forgot'], 'flex') }}>Forgot your password?</p>
                      </div>
                      <Button
                          variant='primary'
                          isLoading={isLoading}
                          type='submit'
                          className='mt-2'
                      >Login</Button>
                      <div className='sm:hidden flex items-center gap-1 justify-between w-full'>
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
      makeUnauthenticatedRequest('get', `/api/v1/auth/forgot-password?email=${values.email}`)
      .then( res => {
          if(res.data.success){
              sessionStorage.setItem('e', values.email);
              fadeParentAndReplacePage(pages['parent'], pages['forgot'], pages['forgot-verification'], 'flex')
          } else {
              toast.error(res.data.error.msg)
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

      makeUnauthenticatedRequest('get', `/api/v1/auth/verify-otp?email=${email}&otp=${OTP}`)
      .then( res => {
          if(res.data.success){
              sessionStorage.setItem('o', OTP);
              fadeParentAndReplacePage(pages['parent'], pages['forgot'], pages['forgot-new-password'], 'flex')
          } else {
              toast.error(res.data.error.msg)
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
      setTimeout(() => router.navigate({ to: '/'}), 1000)
      return
      makeUnauthenticatedRequest(
          'post', 
          '/api/v1/auth/update-password',
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
              }), 1000)
              toggleLoading()
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
