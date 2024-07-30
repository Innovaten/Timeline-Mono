import { Button, Input, TextEditor } from '@repo/ui'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { Formik, Form, ErrorMessage } from 'formik'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $insertNodes, $getRoot } from 'lexical'
import * as Yup from 'yup'
import { useEffect, useRef, useState } from 'react';
import { LexicalEditor } from 'lexical'
import { _getToken, abstractAuthenticatedRequest, abstractUnauthenticatedRequest, useLoading } from '@repo/utils';
import { toast } from 'sonner';
import { useAnnouncement } from '../hooks';

export const Route = createLazyFileRoute('/classes/$classCode/announcements/$announcementCode/update')({
    component: CreateAnnouncement
})


function CreateAnnouncement(){

    const { isLoading, toggleLoading, resetLoading } = useLoading()
    const { classCode, announcementCode } = Route.useParams()

    const { isLoading: announcementContentUpdated, toggleLoading: toggleAnnouncementContentUpdated } = useLoading()
    const { isLoading: publishIsLoading, toggleLoading: togglePublishIsLoading, resetLoading: resetPublishLoading } = useLoading()
    
    const editorRef = useRef<LexicalEditor>();

    const { isLoading: announcementIsLoading, announcement } = useAnnouncement(false, announcementCode, false);

    const navigate = Route.useNavigate()


    function handleUpdateAnnouncement(values: { 
        title: string,
        content: string
    }) {

        if(!announcement) return

        abstractUnauthenticatedRequest(
            "patch",
            `/api/v1/announcements/${announcement._id}`,
            {
                title: values.title,
                content: values.content,
                classCode: classCode,
                isDraft: false,
                authToken: _getToken(),
            },
            {},
            {
                onStart: toggleLoading,
                onSuccess: (data)=>{ 
                    toast.success("Announcement created successfully")
                    navigate({
                        to: `/classes/${classCode}/announcements`
                    })
                },
                onFailure: (err) =>{ toast.error(`${err.msg}`) },
                finally: resetLoading,
            }
        )
    }

    function handlePublishAnnouncement(){
        if(!announcement) return

        abstractAuthenticatedRequest(
            "get",
            `/api/v1/announcements/${announcement._id}/publish?classCode=${classCode}&isId=true`,
            {},
            {},
            {
                onStart: togglePublishIsLoading,
                onSuccess: (data)=>{ 
                    toast.success("Announcement published successfully")
                    setTimeout(() => {
                        navigate({
                            to: `/classes/${classCode}/announcements`
                        })
                    }, 500)
                },
                onFailure: (err) =>{ toast.error(`${err.msg}`) },
                finally: resetPublishLoading,
            }
        )
    }

    const initialValues = {
        title: "",
        content: ""
    }

    useEffect(() => {
        if(!announcement) return
        if(!editorRef.current) return

        if(announcementContentUpdated) return  
        editorRef.current.update(() => {
            const parser = new DOMParser()

            const dom = parser.parseFromString(announcement.content, "text/html");

            // @ts-ignore
            const nodes = $generateNodesFromDOM(editorRef.current, dom);
            $getRoot().clear();
            $getRoot().select();
            $insertNodes(nodes);
        })

        toggleAnnouncementContentUpdated()

    }, [announcement])

    return (
        <>
            <div className='flex flex-col w-full h-[calc(100vh-7rem)] sm:h-full'>
                <div className='mt-2 flex h-fit justify-between items-center'>
                    <h3 className='text-blue-800'>Update Announcement</h3>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={updateAnnouncementValidationSchema}
                    onSubmit={handleUpdateAnnouncement}
                >
                    { form => {
                           
                        useEffect(() => {
                            form.setFieldValue("title", announcement?.title)
                        }, [announcement])

                        return (
                            <>
                                <div className={` ${announcementIsLoading ? "hidden" : "flex" } flex-col justify-between w-full h-[calc(100%-1rem)]`}>
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
                                        {
                                            announcement?.isDraft &&
                                            <Button className='!w-[130px]' variant='outline' isLoading={publishIsLoading} onClick={handlePublishAnnouncement}>Publish</Button>
                                        }
                                    </div>
                                </div>
                                <div className={` ${announcementIsLoading ? "flex" : "hidden" }`}>
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

const updateAnnouncementValidationSchema = Yup.object({
    title: Yup.string().required("Title is required").min(4, "Title is too short").max(256, "Title is too long"),
    content: Yup.string().required("Content is required"),
})