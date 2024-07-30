import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Input, TextEditor } from '@repo/ui'
import { Formik, Form } from 'formik'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $insertNodes, $getRoot } from 'lexical'
import * as Yup from 'yup'
import { useEffect, useRef, useState } from 'react';
import { LexicalEditor } from 'lexical'
import { _getToken, abstractAuthenticatedRequest, abstractUnauthenticatedRequest, useLoading } from '@repo/utils';
import { toast } from 'sonner';
import { useLesson } from '../hooks';
export const Route = createLazyFileRoute('/classes/$classCode/modules/$moduleCode/lessons/$lessonCode/update')({
  component: CreateLesson
})




function CreateLesson(){

    const { isLoading, toggleLoading, resetLoading } = useLoading()
    const { classCode, moduleCode, lessonCode } = Route.useParams()

    const { isLoading: lessonContentUpdated, toggleLoading: toggleModuleContentUpdated } = useLoading()
    const { isLoading: publishIsLoading, toggleLoading: togglePublishIsLoading, resetLoading: resetPublishLoading } = useLoading()
    
    const editorRef = useRef<LexicalEditor>();

    const { isLoading: lessonIsLoading, lesson } = useLesson(false, lessonCode, false);

    const navigate = Route.useNavigate()


    function handleUpdateLesson(values: { 
        title: string,
        content: string
    }) {

      console.log(lesson)
        if(!lesson) return

        abstractUnauthenticatedRequest(
            "patch",
            `/api/v1/lessons/${lesson._id}`,
            {
                title: values.title,
                content: values.content,
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
                                <div className={` ${lessonIsLoading ? "hidden" : "flex" } flex-col justify-between w-full h-[calc(100%-1rem)]`}>
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