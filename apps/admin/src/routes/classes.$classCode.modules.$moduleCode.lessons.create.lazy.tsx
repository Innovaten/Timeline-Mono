import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Input, TextEditor, FileUploader } from '@repo/ui'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Formik, Form } from 'formik'
import {$generateHtmlFromNodes} from '@lexical/html';
import * as Yup from 'yup'
import { useRef } from 'react';
import { LexicalEditor } from 'lexical'
import { _getToken, abstractUnauthenticatedRequest, useLoading, useFileUploader, abstractAuthenticatedRequest} from '@repo/utils';
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/classes/$classCode/modules/$moduleCode/lessons/create')({
  component: CreateLesson
})



function CreateLesson(){

    const filesHook = useFileUploader();
    const { isLoading, toggleLoading, resetLoading } = useLoading()
    const { classCode, moduleCode } = Route.useParams()
    const navigate = Route.useNavigate()

    const editorRef = useRef<LexicalEditor>();

    function handleCreateLesson(values: { 
        title: string,
        content: string
    }) {
        abstractAuthenticatedRequest(
            "post",
            "/api/v1/lessons",
            {
                title: values.title,
                content: values.content ?? "",
                moduleCode: moduleCode,
                authToken: _getToken(),
                resources: filesHook.files.map(f => f._id)
            },
            {},
            {
                onStart: toggleLoading,
                onSuccess: (data)=>{ 
                    toast.success("Lesson created successfully")
                    navigate({
                        to: `/classes/${classCode}/modules/${moduleCode}/lessons`
                    })
                },
                onFailure: (err) =>{ toast.error(`${err.msg}`) },
                finally: resetLoading,
            }
        )
    }


    return (
        <>
            <div className='flex flex-col w-full h-[calc(100vh-7rem)] sm:h-full'>
                <div className='mt-2 flex h-fit justify-between items-center'>
                    <h3 className='text-blue-800'>Create new Lesson</h3>
                </div>
                <Formik
                    initialValues={createLessonInitialValues}
                    validationSchema={createLessonValidationSchema}
                    onSubmit={handleCreateLesson}

                >
                    { form => {
                        return (
                            <>
                                <div className='flex flex-col justify-between w-full h-[calc(100%-1rem)]'>
                                    <div className='w-full h-[calc(100%-4rem)] mt-4 overflow-auto'>
                                        <Form className='flex flex-col gap-6 w-full h-full'>
                                            <Input name='title'  label='Title' hasValidation />
                                            <div className='flex flex-col mt-1 flex-1'>
                                                <TextEditor hasValidation name="content" editorRef={editorRef} onChange={(editorState, editor) => {
                                                    editor.update(() => {
                                                        form.setFieldValue("content", $generateHtmlFromNodes(editor, null))
                                                    })
                                                }} />
                                            </div>
                                        </Form>
                                    </div>
                                    <div className='flex flex-col w-full gap-3 sm:flex-row sm:justify-between items-center'>
                                        <div className='flex flex-1 gap-2 overflow-x-auto'>
                                            { filesHook.files.map((resource, idx) => {
                                                    return (
                                                        <a className='flex max-w-[200px] justify-between gap-2 p-1 rounded-sm bg-blue-600/20' target='_blank' href={resource.link} key={idx}>
                                                            <small className='truncate font-extralight'>{decodeURIComponent(resource.title)}</small>
                                                            <XMarkIcon className="w-3 flex-shrink-0 text-blue-700" onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); filesHook.removeSpecificFile(`${resource._id}` )}} />
                                                        </a>
                                                    )
                                                })    
                                            }
                                            { filesHook.files.length == 0 && 
                                                    <p className='text-blue-700'>No resources uploaded</p>
                                            }
                                        </div>
                                    
                                        <div className='flex flex-col sm:flex-row sm:h-16 flex-shrink-0 sm:justify-end sm:items-center gap-2'>
                                            <FileUploader filesHook={filesHook} buttonVariant='outline'/>
                                            <Button isDisabled={!form.isValid} isLoading={isLoading} onClick={form.submitForm}>Create Lesson</Button>
                                        </div>
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


const createLessonInitialValues  = {
    title: "",
    content: ""
}

const createLessonValidationSchema = Yup.object({
    title: Yup.string().required("Title is required").min(4, "Title is too short").max(256, "Title is too long"),
    content: Yup.string().optional(),
})