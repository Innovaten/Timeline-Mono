import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Input, TextEditor, FileUploader } from '@repo/ui'
import { Formik, Form } from 'formik'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $insertNodes, $getRoot } from 'lexical'
import * as Yup from 'yup'
import { useEffect, useRef } from 'react';
import { LexicalEditor } from 'lexical'
import { _getToken, abstractUnauthenticatedRequest, useLoading, useFileUploader} from '@repo/utils';
import { toast } from 'sonner';
import { useLesson } from '../../../../../hooks';
import { XMarkIcon } from   '@heroicons/react/24/outline'
import { ILesson } from '@repo/models'

export const Route = createLazyFileRoute('/classes/$classCode/modules/$moduleCode/lessons/$lessonCode/update')({
  component: CreateLesson
})

function CreateLesson(){

    const { isLoading, toggleLoading, resetLoading } = useLoading()
    const { classCode, moduleCode, lessonCode } = Route.useParams()

    const { isLoading: lessonContentUpdated, toggleLoading: toggleModuleContentUpdated } = useLoading()
    // const { isLoading: publishIsLoading, toggleLoading: togglePublishIsLoading, resetLoading: resetPublishLoading } = useLoading()
    
    const editorRef = useRef<LexicalEditor>();

    const { isLoading: lessonIsLoading, lesson } = useLesson(false, lessonCode, false);

    const navigate = Route.useNavigate()
    const filesHook = useFileUploader()

    function handleUpdateLesson(values: { 
        title: string,
        content: string
    }) {
        if(!lesson) return

        const changedValues: Partial<ILesson> = {}
        
        Object.keys(values).map((field) => {
            // @ts-ignore
            if(values[field] !== lesson[field]){
                //@ts-ignore
                changedValues[field] = values[field]
            }
        })

        abstractUnauthenticatedRequest(
            "patch",
            `/api/v1/lessons/${lesson._id}`,
            {
                ...changedValues,
                resources: filesHook.files.map(f => f._id),
                authToken: _getToken(),
            },
            {},
            {
                onStart: toggleLoading,
                onSuccess: (data)=>{ 
                    toast.success("Lesson updated successfully")
                    navigate({
                        to: `/classes/${classCode}/modules/${moduleCode}/lessons`
                    })
                },
                onFailure: (err) =>{ toast.error(`${err.msg}`) },
                finally: resetLoading,
            }
        )
    }

    const initialValues = {
        title: "",
        content: ""
    }

    useEffect(() => {
        if(!lesson) return
        if(!editorRef.current) return

        if(lessonContentUpdated) return  
        editorRef.current.update(() => {
            const parser = new DOMParser()

            const dom = parser.parseFromString(lesson.content, "text/html");

            // @ts-ignore
            const nodes = $generateNodesFromDOM(editorRef.current, dom);
            $getRoot().clear();
            $getRoot().select();
            $insertNodes(nodes);
        })
        lesson.resources?.forEach((r) =>{ filesHook.addToFiles(r) })

        toggleModuleContentUpdated()

    }, [lesson])

    return (
        <>
            <div className='flex flex-col w-full h-[calc(100vh-7rem)] sm:h-full'>
                <div className='mt-2 flex h-fit justify-between items-center'>
                    <h3 className='text-blue-800'>Update Lesson</h3>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={updateLessonValidationSchema}
                    onSubmit={handleUpdateLesson}
                    >
                    { form => {
                           
                        useEffect(() => {
                            form.setFieldValue("title", lesson?.title)
                        }, [lesson])

                        return (
                            <>
                                <div className={`${lessonIsLoading ? "hidden" : "flex" } flex-col justify-between w-full h-[calc(100%-1rem)]`}>
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
                                    <div className='flex h-16 flex-shrink-0 justify-end items-center w-full gap-4'>
                                        <div className='flex-1 w-full sm:w-fit flex-shrink-0 flex gap-2 flex-row-reverse justify-between items-center'>
                                            <div className='flex-shrink-0'>
                                                <FileUploader buttonVariant='outline' filesHook={filesHook} />
                                            </div>
                                            <div className='flex flex-shrink-0 gap-2 overflow-x-auto'>
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
                                        </div>
                                        <Button className='!w-[130px]' isDisabled={!form.isValid} isLoading={isLoading} onClick={form.submitForm}>Save</Button>
                                    </div>
                                </div>
                                <div className={` ${lessonIsLoading ? "flex" : "hidden" }`}>
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

const updateLessonValidationSchema = Yup.object({
    title: Yup.string().required("Title is required").min(4, "Title is too short").max(256, "Title is too long"),
    content: Yup.string().optional()
})