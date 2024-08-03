import { Button, DialogContainer, Input, TextEditor } from '@repo/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Formik, Form } from 'formik'
import {$generateHtmlFromNodes} from '@lexical/html';
import * as Yup from 'yup'
import { useRef, useState } from 'react';
import { LexicalEditor } from 'lexical'
import { _getToken, abstractUnauthenticatedRequest, cn, useFileUploader, useToggleManager } from '@repo/utils';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { useStudentsInClass } from '../hooks';
import { IUserDoc } from '@repo/models';

export const Route = createLazyFileRoute('/classes/$classCode/assignments/create')({
    component: CreateAssignment
})


function CreateAssignment(){

    const initialToggles = {
        'create-is-loading': false,

        'additional-dialog': false,
    
    }
    
    type TogglesType = typeof initialToggles
    type ToggleKeys = keyof TogglesType
    const toggleManager = useToggleManager<ToggleKeys>(initialToggles);

    const { classCode } = Route.useParams()
    const navigate = Route.useNavigate()

    const filesHook = useFileUploader()
    const [ accessList, setAccessList ] = useState<string[]>([]);
    const { students, isLoading: studentsIsLoading} = useStudentsInClass(true, classCode, false);


    const editorRef = useRef<LexicalEditor>();

    function handleCreateAssignment(values: { 
        title: string,
        instructions: string,
        maxScore: number,
        startDate: string,
        endDate: string,
    }) {

        abstractUnauthenticatedRequest(
            "post",
            `/api/v1/classes/${classCode}/assignments`,
            {
                title: values.title,
                instructions: values.instructions,
                maxScore: values.maxScore,
                isDraft: false,
                startDate: values.startDate,
                endDate: values.endDate,
                resources: filesHook.files,
                authToken: _getToken(),
            },
            {},
            {
                onStart: ()=> { toggleManager.toggle('create-is-loading')},
                onSuccess: (data)=>{ 
                    toast.success("Assignment created successfully")
                    toggleManager.reset('additional-dialog')
                    navigate({
                        to: `/classes/${classCode}/assignments`
                    })
                },
                onFailure: (err) =>{ toast.error(`${err.msg}`) },
                finally: ()=>{ toggleManager.reset('create-is-loading')},
            }
        )
    }

    function saveAsDraft(values: { 
        title: string,
        instructions: string,
        maxScore: number,
        startDate: string,
        endDate: string,
    }) {

        abstractUnauthenticatedRequest(
            "post",
            `/api/v1/classes/${classCode}/assignments`,
            {
                title: values.title,
                instructions: values.instructions,
                maxScore: values.maxScore,
                isDraft: false,
                startDate: values.startDate,
                endDate: values.endDate,
                resources: filesHook.files,
                authToken: _getToken(),
            },
            {},
            {
                onStart: ()=>{ toggleManager.toggle('create-is-loading')},
                onSuccess: (data)=>{ toast.success("Assignment saved successfully"); toggleManager.reset('additional-dialog')},
                onFailure: (err) =>{ toast.error(`${err.msg}`) },
                finally: ()=>{ toggleManager.reset('create-is-loading')},
            }
        )

    }

    function AdditionalDataDialog({ form }: {form: any}){

        function toggleInAccessList(user: IUserDoc){
            if(accessList.includes(`${user._id}`)){
                setAccessList(prev => prev.filter( id => id != `${user._id}`))
                return
            }

            setAccessList( prev => [ ...prev, `${user._id}`])

        }


        return (
            <>

                <DialogContainer
                    title='Additional Details'
                    toggleOpen={()=>{ toggleManager.toggle('additional-dialog')}}
                    isOpen={toggleManager.get('additional-dialog')}
                    description='Enter the more details to create the assignment'
                >
                    <div className='flex flex-col gap-y-6'>
                        <div className='flex gap-4 w-full'>
                            <Input name='startDate' label='Open Date' type='datetime-local' hasValidation />
                            <Input name='endDate' label='Close Date' type='datetime-local' hasValidation />
                        </div>

                        <Input name='maxScore' label='Maximum Score' step={1} type='number' hasValidation />

                        <div className='flex flex-col gap-1'>
                            <div className='w-full flex justify-between items-center'>
                                <p className='text-blue-900' >Student access</p>
                                <span className='flex gap-1 items-center'>
                                    <label htmlFor='select-all' className='mb-[2px]'>{ accessList.length !== students.length? "S": "Uns" }elect all students</label>
                                    <input type='checkbox' name='select-all' onChange={(e) =>{
                                        const value = e.target.value
                                        console.log(value)
                                        if(value == "on"){
                                            setAccessList(students.map(s => `${s._id}`))
                                        } else {
                                            setAccessList([])
                                        }
                                    }}/>
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-48 overflow-y-auto">
                                {
                                    studentsIsLoading && 
                                    <div className='col-span-1 sm:col-span-2 flex p-4 items-center justify-center'>
                                        <span className='w-4 h-4 rounded-full border-[1.5px] border-t-blue-600 animate-spin'></span>
                                    </div>
                                }
                                {
                                    !studentsIsLoading && students.map((student, idx) => (
                                        <div
                                            key={idx} onClick={()=>{toggleInAccessList(student)}}
                                        className={
                                            cn(
                                                'flex gap-2 items-center bg-blue-50 rounded p-2 border-blue-100 hover:border-blue-700/40 cursor-pointer duration-150 border-[1.5px]', 
                                                accessList.includes(`${student._id}`) ? "border-blue-700/40 bg-blue-700 text-white" : "border-bg-blue-100/40",
                                            )
                                        }  >
                                            <div className='rounded-full flex-shrink-0 aspect-square h-full bg-blue-100 text-blue-700 font-light grid place-items-center'>{student.firstName[0]+student.lastName[0]}</div>
                                            <div className='flex flex-col'>
                                                <p>{student.firstName} {student.lastName}</p>
                                                <small>{student.email}</small>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className='flex w-full justify-end gap-4 mt-4'>
                            <Button className='!w-[130px]' 
                                variant='neutral' 
                                isDisabled={toggleManager.get('create-is-loading')} type='button' 
                                onClick={()=>{ toggleManager.reset('additional-dialog') }}
                            >Close</Button>
                            <Button className='!w-[130px]' 
                                variant='outline' 
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


                </DialogContainer>
            </>
        )

    }

    return (
        <>
            <div className='flex flex-col w-full h-[calc(100vh-7rem)] sm:h-full'>
                <div className='mt-2 flex h-fit justify-between items-center'>
                    <h3 className='text-blue-800'>Create new Assignment</h3>
                </div>
                <Formik
                    initialValues={createAssignmentInitialValues}
                    validationSchema={createAssignmentValidationSchema}
                    onSubmit={handleCreateAssignment}
                >
                    { form => {
                        return (
                            <>
                                <AdditionalDataDialog form={form} />
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
                                            onClick={()=>{ toggleManager.toggle('additional-dialog')}}
                                        >Continue</Button>
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


const createAssignmentInitialValues  = {
    title: "",
    instructions: "",
    maxScore: 10,
    startDate: dayjs().format("YYYY-MM-DDThh:mm"),
    endDate: dayjs().format("YYYY-MM-DDThh:mm"),
}

const createAssignmentValidationSchema = Yup.object({
    title: Yup.string().required("Title is required").min(4, "Title is too short").max(256, "Title is too long"),
    instructions: Yup.string().required("Instruction is required"),
    maxScore: Yup.number().required("Maximum grade is required").min(0, "Grade cannot be less than 0").max(200, "Grade cannot be greater thatn 200"),
    startDate: Yup.string().required("Start date is required")
        .test("startDate", "Must be later than the current time", (value) =>{ return new Date(value).getTime() > new Date().getTime()  })
        .test("startDate", "Must be in this year", (value) =>{ return new Date(value).getTime() < dayjs().endOf("year").toDate().getTime() }),
    endDate: Yup.string().required("End date is required")
    .test('end-is-after-start', "Must be later than the start date", (endDate, ctx) => {
        const { startDate } = ctx.parent;
        if(startDate){
            return new Date(startDate).getTime() < new Date(endDate).getTime();
        }
    })
})