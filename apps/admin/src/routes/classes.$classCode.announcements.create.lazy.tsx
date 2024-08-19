import { Button, Input, TextEditor } from '@repo/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Formik, Form } from 'formik'
import {$generateHtmlFromNodes} from '@lexical/html';
import * as Yup from 'yup'
import { useRef } from 'react';
import { LexicalEditor } from 'lexical'
import { _getToken, abstractUnauthenticatedRequest, useToggleManager } from '@repo/utils';
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/classes/$classCode/announcements/create')({
    component: CreateAnnouncement
})


function CreateAnnouncement(){

    const initialToggles = {
        'create-is-loading': false,
    }
    
    type TogglesType = typeof initialToggles
    type ToggleKeys = keyof TogglesType
    const toggleManager = useToggleManager<ToggleKeys>(initialToggles);

    const { classCode } = Route.useParams()
    const navigate = Route.useNavigate()

    const editorRef = useRef<LexicalEditor>();

    function handleCreateAnnouncement(values: { 
        title: string,
        content: string
    }) {

        abstractUnauthenticatedRequest(
            "post",
            "/api/v1/announcements",
            {
                title: values.title,
                content: values.content,
                classCode: classCode,
                isDraft: false,
                authToken: _getToken(),
            },
            {},
            {
                onStart: ()=> { toggleManager.toggle('create-is-loading')},
                onSuccess: (data)=>{ 
                    toast.success("Announcement created successfully")
                    navigate({
                        to: `/classes/${classCode}/announcements`
                    })
                },
                onFailure: (err) =>{ toast.error(`${err.msg}`) },
                finally: ()=>{ toggleManager.reset('create-is-loading')},
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
                classCode: classCode,
                isDraft: true,
                authToken: _getToken(),
            },
            {},
            {
                onStart: ()=>{ toggleManager.toggle('create-is-loading')},
                onSuccess: (data)=>{ toast.success("Announcement saved successfully")},
                onFailure: (err) =>{ toast.error(`${err.msg}`) },
                finally: ()=>{ toggleManager.reset('create-is-loading')},
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
                    onSubmit={handleCreateAnnouncement}

                >
                    { form => {
                        return (
                            <>
                                <div className='flex flex-col justify-between w-full h-[calc(100%-1rem)]'>
                                    <div className='w-full h-[calc(100%-4rem)] mt-4 overflow-auto'>
                                        <Form className='flex flex-col gap-6 w-full h-full'>
                                            <Input name='title'  label='Title' hasValidation />
                                            <div className='flex flex-col mt-1 flex-1'>
                                                <TextEditor 
                                                    hasValidation 
                                                    name="content" 
                                                    editorRef={editorRef} 
                                                    onChange={(_, editor) => {
                                                        editor.update(() => {
                                                            form.setFieldValue("content", $generateHtmlFromNodes(editor, null))
                                                        })
                                                    }} 
                                                />
                                            </div>
                                        </Form>
                                    </div>
                                    <div className='flex h-16 flex-shrink-0 justify-end items-center w-full gap-4'>
                                        <Button className='!w-[130px]' 
                                            variant='neutral' 
                                            isDisabled={!form.isValid} 
                                            isLoading={toggleManager.get('create-is-loading')} type='button' 
                                            onClick={()=>{ saveAsDraft(form.values)}}
                                        >Save as Draft</Button>
                                        <Button className='!w-[130px]' 
                                            isDisabled={!form.isValid} 
                                            isLoading={toggleManager.get('create-is-loading')} 
                                            onClick={form.submitForm}
                                        >Save</Button>
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