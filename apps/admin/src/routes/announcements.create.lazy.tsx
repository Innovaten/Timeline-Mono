import { Button, Input, TextEditor } from '@repo/ui'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { Formik, Form, ErrorMessage } from 'formik'
import {$generateHtmlFromNodes} from '@lexical/html';
import * as Yup from 'yup'
import { useState } from 'react';
import { LexicalEditor } from 'lexical'
import { _getToken, abstractUnauthenticatedRequest, useLoading } from '@repo/utils';
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/announcements/create')({
    component: CreateAnnouncement
})


function CreateAnnouncement(){

    const { isLoading, toggleLoading, resetLoading } = useLoading()

    function handleCreateAnnouncment(values: { 
        title: string,
        content: string
    }) {

        abstractUnauthenticatedRequest(
            "post",
            "/api/v1/announcements",
            {
                title: values.title,
                content: values.content,
                isDraft: false,
                authToken: _getToken(),
            },
            {},
            {
                onStart: toggleLoading,
                onSuccess: (data)=>{ toast.success("Announcement created successfully")},
                onFailure: (err) =>{ toast.error(`${err.msg}`) },
                finally: resetLoading,
            }
        )
    }


    function saveAsDraft(values: { 
        title: string,
        content: string,
    }) {

        abstractUnauthenticatedRequest(
            "post",
            "/api/v1/announcements",
            {
                title: values.title,
                content: values.content,
                isDraft: true,
                authToken: _getToken(),
            },
            {},
            {
                onStart: toggleLoading,
                onSuccess: (data)=>{ toast.success("Announcement created successfully")},
                onFailure: (err) =>{ toast.error(`${err.msg}`) },
                finally: resetLoading,
            }
        )

    }

    return (
        <>
            <div className='flex flex-col w-full h-[calc(100vh-7rem)] sm:h-full'>
                <div className='mt-2 flex h-fit justify-between items-center'>
                    <h3 className='text-blue-800'>Create new Announcement</h3>
                </div>
                <Formik
                    initialValues={createAnnouncementInitialValues}
                    validationSchema={createAnnouncementValidationSchema}
                    onSubmit={handleCreateAnnouncment}

                >
                    { form => {
                        return (
                            <>
                                <div className='flex flex-col justify-between w-full h-[calc(100%-1rem)]'>
                                    <div className='w-full h-[calc(100%-4rem)] mt-4 overflow-auto'>
                                        <Form className='flex flex-col gap-6 w-full h-full'>
                                            <Input name='title'  label='Title' hasValidation />
                                            <div className='flex flex-col mt-1 flex-1'>
                                                <TextEditor hasValidation name="content" onChange={(editorState, editor) => {
                                                    editor.update(() => {
                                                        form.setFieldValue("content", $generateHtmlFromNodes(editor, null))
                                                    })
                                                }} />
                                            </div>
                                        </Form>
                                    </div>
                                    <div className='flex h-16 flex-shrink-0 justify-end items-center w-full gap-4'>
                                        <Button className='!w-[130px]' variant='neutral' isDisabled={!form.isValid} isLoading={isLoading} type='button' onClick={()=>{ saveAsDraft(form.values)}}>Save as Draft</Button>
                                        <Button className='!w-[130px]' isDisabled={!form.isValid} isLoading={isLoading} onClick={form.submitForm}>Save</Button>
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


const createAnnouncementInitialValues  = {
    title: "",
    content: ""
}

const createAnnouncementValidationSchema = Yup.object({
    title: Yup.string().required("Title is required").min(4, "Title is too short").max(256, "Title is too long"),
    content: Yup.string().required("Content is required"),
})