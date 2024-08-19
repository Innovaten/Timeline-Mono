// import { createLazyFileRoute } from '@tanstack/react-router'
// import { Button, Input, TextEditor } from '@repo/ui'
// import { Formik, Form, ErrorMessage } from 'formik'
// import {$generateHtmlFromNodes} from '@lexical/html';
// import * as Yup from 'yup'
// import { useRef, useState } from 'react';
// import { LexicalEditor } from 'lexical'
// import { _getToken, abstractUnauthenticatedRequest, useLoading } from '@repo/utils';
// import { toast } from 'sonner';

// export const Route = createLazyFileRoute('/classes/$classCode/modules/create')({
//     component: CreateModule
// })


// function CreateModule(){

//     const { isLoading, toggleLoading, resetLoading } = useLoading()
//     const { classCode } = Route.useParams()
//     const navigate = Route.useNavigate()

//     function handleCreateModule(values: { 
//         title: string,
//     }) {

//         abstractUnauthenticatedRequest(
//             "post",
//             "/api/v1/modules",
//             {
//                 title: values.title,
//                 classCode: classCode,
//                 isDraft: false,
//                 authToken: _getToken(),
//             },
//             {},
//             {
//                 onStart: toggleLoading,
//                 onSuccess: (data)=>{ 
//                     toast.success("Module created successfully")
//                     navigate({
//                         to: `/classes/${classCode}/modules`
//                     })
//                 },
//                 onFailure: (err) =>{ toast.error(`${err.msg}`) },
//                 finally: resetLoading,
//             }
//         )
//     }


//     function saveAsDraft(values: { 
//         title: string,
//     }) {

//         abstractUnauthenticatedRequest(
//             "post",
//             "/api/v1/modules",
//             {
//                 title: values.title,
//                 classCode: classCode,
//                 isDraft: true,
//                 authToken: _getToken(),
//             },
//             {},
//             {
//                 onStart: toggleLoading,
//                 onSuccess: (data)=>{ toast.success("Module saved successfully")},
//                 onFailure: (err) =>{ toast.error(`${err.msg}`) },
//                 finally: resetLoading,
//             }
//         )

//     }

//     return (
//         <>
//             <div className='flex flex-col w-full h-[calc(100vh-7rem)] sm:h-full'>
//                 <div className='mt-2 flex h-fit justify-between items-center'>
//                     <h3 className='text-blue-800'>Create new a Module</h3>
//                 </div>
//                 <Formik
//                     initialValues={createModuleInitialValues}
//                     validationSchema={createModuleValidationSchema}
//                     onSubmit={handleCreateModule}

//                 >
//                     { form => {
//                         return (
//                             <>
//                                 <div className='flex flex-col justify-between w-full h-[calc(100%-1rem)]'>
//                                     <div className='w-full h-[calc(100%-4rem)] mt-4 overflow-auto'>
//                                         <Form className='flex flex-col gap-6 w-full'>
//                                             <Input name='module'  label='Module Name' hasValidation />
//                                         </Form>

//                                         <div className='flex h-16 flex-shrink-0 justify-end items-center w-full gap-4'>
//                                         <Button className='!w-[130px]' variant='neutral' isDisabled={!form.isValid} isLoading={isLoading} type='button' onClick={()=>{ saveAsDraft(form.values)}}>Save as Draft</Button>
//                                         <Button className='!w-[130px]' isDisabled={!form.isValid} isLoading={isLoading} onClick={form.submitForm}>Save</Button>
//                                     </div>
//                                     </div>
                                    
//                                 </div>
//                             </>
//                         )
//                     }}
//                 </Formik>
//             </div>
//         </> 
//     )
// }


// const createModuleInitialValues  = {
//     title: ""
// }

// const createModuleValidationSchema = Yup.object({
//     title: Yup.string().required("Module name is required").min(4, "Module name is too short").max(256, "Module name is too long"),

// })