import { Input, Button } from '@repo/ui'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useLoading } from '@repo/utils'

export default function IndexPage(){

    const { isLoading, toggleLoading, resetLoading } = useLoading()

    function handleSubmit(values: { email: string, password: string}){
        toggleLoading()
        console.log(values)
        alert(values);
        toggleLoading()
    }

    function handleReset(){
        resetLoading();
    }

    return (
        <>
            <main className="w-screen h-screen bg-blue-50 md:p-16 overflow-hidden">
                <div className="flex flex-col items-center">
                    <img className='my-4 sm:my-12 md:my-16t' src="/img/timeline-logo.png" />
                    <div className='flex w-full h-[90vh] sm:w-[80%] sm:h-fit sm:min-h-[500px] xl:w-[1000px] 2xl:w-[1100px] bg-white rounded shadow overflow-hidden'>
                        <div className='w-1/2 hidden sm:block'>
                            <img className='object-cover w-full' src="/img/login-teacher-image.jpg" />
                        </div>
                        <div className='w-full sm:w-1/2  p-8 flex flex-col gap-4 sm:justify-between'>
                            <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            onReset={handleReset}
                            validateOnBlur
                            >
                                <Form className='flex flex-col gap-4 sm:gap-6'>
                                    <h1 className='text-blue-950 my-3'>Login</h1>
                                    <Input id='e' name='email' label='Email Address' placeholder="kwabena@example.com" hasValidation />
                                    <Input id='p' name='password' label='Password' placeholder="********" hasValidation />
                                    <Button
                                        variant='primary'
                                        isLoading={isLoading}
                                        type='submit'
                                        className='mt-2'
                                    >Login</Button>
                                </Form>
                            </Formik>
                            <a className='text-blue-700 underline-offset-2 underline mx-auto mt-4 sm:mt-0'>Forgot your password?</a>
                            
                            
                            <div className='absolute flex sm:hidden bottom-10 flex-col items-center w-[calc(100vw-4rem)] #m-auto text-blue-600'>
                                <p>&copy; {new Date().getFullYear()} Timeline Trust. All Rights Reserved.</p>
                                <p>Powered By <a>Innovaten</a></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='absolute hidden sm:flex bottom-10 flex-col items-center gap-2 w-full sm:w-[calc(100vw-8rem)] m-auto text-blue-600'>
                    <p>&copy; {new Date().getFullYear()} Timeline Trust. All Rights Reserved.</p>
                    <p>Powered By <a>Innovaten</a></p>
                </div>
            </main>
        </>
    )
}

const initialValues = {
    email: "",
    password: ""
}

const validationSchema = Yup.object({
    email: Yup.string()
        .email("Please enter a valid email")
        .required('Please enter your email address')
        .min(4, 'Email is too short')
        .max(64, "Email is too long"),
    password: Yup.string()
        .required('Please enter your password')
        .min(8, 'Password must be a minimum of 8 characters')
        .max(128, "Password is too long")
    // TODO: Add more robust validations
})