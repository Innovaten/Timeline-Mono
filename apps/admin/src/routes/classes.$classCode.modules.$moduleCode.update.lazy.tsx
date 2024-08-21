import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Button, Input, TextEditor, FileUploader } from '@repo/ui'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react';
import { _getToken, abstractUnauthenticatedRequest, useLoading, useFileUploader} from '@repo/utils';
import { toast } from 'sonner';
import { useModule } from '../hooks';
import { XMarkIcon } from   '@heroicons/react/24/outline'

export const Route = createLazyFileRoute('/classes/$classCode/modules/$moduleCode/update')({
  component: UpdateModule
})



function UpdateModule(){

    const { isLoading, toggleLoading, resetLoading } = useLoading()
    const { classCode, moduleCode } = Route.useParams()


    const { isLoading: moduleIsLoading, module } = useModule(false, moduleCode, false);

    const navigate = Route.useNavigate()
    const filesHook = useFileUploader()


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
                resource: filesHook.files.map(f => f._id)
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
                                    <div className='flex-1 w-full sm:w-fit flex-shrink-0 flex gap-2 flex-row-reverse justify-between items-center'>
                                 
                                        <div className='flex flex-shrink-0 gap-2 overflow-x-auto'>
                                        { filesHook.files.map((resource, idx) => {
                                                return (
                                                    <a className='flex max-w-[200px] justify-between gap-2 p-1 rounded-sm bg-blue-600/20' target='_blank' href={resource.link} key={idx}>
                                                        <small className='truncate font-extralight'>{resource.title}</small>
                                                        <XMarkIcon className="w-3 flex-shrink-0 text-blue-700" onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); filesHook.removeSpecificFile(resource.id)}} />
                                                    </a>
                                                )
                                            })    
                                        }
                                        { filesHook.files.length == 0 && 
                                                <p className='text-blue-700'>No resources uploaded</p>
                                        }
                                        </div>

                                    </div>
                                    <div className='w-full sm:w-fit shrink-0 flex flex-col sm:flex-row gap-2 self-end -mt-12'>
                                        <div className='flex-shrink-0'>
                                            <FileUploader buttonVariant='outline' filesHook={filesHook} />
                                        </div>
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