import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Input, TextEditor } from '@repo/ui'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react';
import { _getToken, abstractUnauthenticatedRequest, useLoading } from '@repo/utils';
import { toast } from 'sonner';
import { useModule } from '../hooks';


export const Route = createLazyFileRoute('/classes/$classCode/modules/$moduleCode/update')({
  component: UpdateModule
})



function UpdateModule(){

    const { isLoading, toggleLoading, resetLoading } = useLoading()
    const { classCode, moduleCode } = Route.useParams()


    const { isLoading: moduleIsLoading, module } = useModule(false, moduleCode, false);

    const navigate = Route.useNavigate()


    function handleUpdateModule(values: { 
        title: string,
    }) {

        if(!module) return

        abstractUnauthenticatedRequest(
            "patch",
            `/api/v1/modules/${module._id}`,
            {
                title: values.title,
                classCode: classCode,
                authToken: _getToken(),
            },
            {},
            {
                onStart: toggleLoading,
                onSuccess: (data)=>{ 
                    toast.success("Module created successfully")
                    navigate({
                        to: `/classes/${classCode}/modules`
                    })
                },
                onFailure: (err) =>{ toast.error(`${err.msg}`) },
                finally: resetLoading,
            }
        )
    }


    const initialValues = {
        title: "",
    }


    return (
        <>
            <div className='flex flex-col w-full h-[calc(100vh-7rem)] sm:h-full'>
                <div className='mt-2 flex h-fit justify-between items-center'>
                    <h3 className='text-blue-800'>Update Module</h3>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={updateModuleValidationSchema}
                    onSubmit={handleUpdateModule}
                >
                    { form => {
                           
                        useEffect(() => {
                            form.setFieldValue("title", module?.title)
                        }, [module])

                        return (
                            <>
                                <div className={` ${moduleIsLoading ? "hidden" : "flex" } flex-col justify-between w-full h-[calc(100%-1rem)]`}>
                                    <div className='w-full h-[calc(100%-4rem)] mt-4 overflow-auto'>
                                        <Form className='flex flex-col gap-6 w-full h-full'>
                                            <Input name='title'  label='Title' hasValidation />
                                        </Form> 
                                    </div>
                                    <div className='flex h-16 flex-shrink-0 justify-end items-center w-full gap-4'>
                                        <Button className='!w-[130px]' isDisabled={!form.isValid} isLoading={isLoading} onClick={form.submitForm}>Save</Button>
                                    </div>
                                </div>
                                <div className={` ${moduleIsLoading ? "flex" : "hidden" }`}>
                                    <div className='w-full h-full m-auto mt-4'>
                                        <div
                                        className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                                        ></div>
                                    </div>
                                </div>
                            </>
                        )
                    }}
                </Formik>
            </div>
        </> 
    )
}

const updateModuleValidationSchema = Yup.object({
    title: Yup.string().required("Title is required").min(4, "Title is too short").max(256, "Title is too long"),
})