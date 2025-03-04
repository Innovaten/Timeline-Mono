import { Button, DialogContainer, FileUploader, Input, TextEditor } from '@repo/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Formik, Form, FormikProps } from 'formik'
import { XMarkIcon } from   '@heroicons/react/24/outline'
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';
import * as Yup from 'yup'
import { useEffect, useRef, useState } from 'react';
import { LexicalEditor, $insertNodes, $getRoot } from 'lexical'
import { _getToken, abstractAuthenticatedRequest, abstractUnauthenticatedRequest, cn, useFileUploader, useToggleManager } from '@repo/utils';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { useAssignment, useStudentsInClass } from '../hooks';
import { IAssignment, IUserDoc } from '@repo/models';

export const Route = createLazyFileRoute('/classes/$classCode/assignments/$assignmentCode/update')({
    component: UpdateAssignment
})


function UpdateAssignment(){

    const initialToggles = {
        'update-is-loading': false,

        'content-hydrated': false,

        'additional-dialog': false,
    
    }
    
    type TogglesType = typeof initialToggles
    type ToggleKeys = keyof TogglesType
    const toggleManager = useToggleManager<ToggleKeys>(initialToggles);

    const { classCode, assignmentCode } = Route.useParams()
    const navigate = Route.useNavigate()

    const filesHook = useFileUploader()
    const [ accessList, setAccessList ] = useState<string[]>([]);
    const { students, isLoading: studentsIsLoading} = useStudentsInClass(true, classCode, false);

    const { assignment, isLoading: assignmentsIsLoading} = useAssignment(true, assignmentCode, false);

    const editorRef = useRef<LexicalEditor>();

    useEffect(() => {
        if(!assignment) return;
        if(!editorRef.current) return
        if(toggleManager.get('content-hydrated')) return  

        //@ts-ignore
        setAccessList(assignment.accessList)
        assignment.resources?.forEach((r) =>{ filesHook.addToFiles(r) })
        
    
        editorRef.current.update(() => {
            const parser = new DOMParser()
    
            const dom = parser.parseFromString(assignment.instructions, "text/html");
    
            // @ts-ignore
            const nodes = $generateNodesFromDOM(editorRef.current, dom);
            $getRoot().clear();
            $getRoot().select();
            $insertNodes(nodes);
        })
    
        toggleManager.toggle('content-hydrated')

    }, [assignment])

    function handleUpdateAssignment(values: { 
        title: string,
        instructions: string,
        maxScore: number,
        startDate: string,
        endDate: string,
    }) {
        const changedValues: Partial<IAssignment> = {}

        Object.keys(values).map((field) => {
            // @ts-ignore
            if(values[field] !== assignment[field]){
                //@ts-ignore
                changedValues[field] = values[field]
            }
        })

        abstractUnauthenticatedRequest(
            "patch",
            `/api/v1/assignments/${assignment?._id}/`,
            {
                ...changedValues,
                ...(changedValues.startDate ? { startDate: new Date(values.startDate).toISOString() } : {} ),
                ...(changedValues.endDate ? { endDate: new Date(values.endDate).toISOString() } : {} ),
                accessList,
                resources: filesHook.files.map(f => f._id),
                authToken: _getToken(),
            },
            {},
            {
                onStart: ()=> { toggleManager.toggle('update-is-loading')},
                onSuccess: (data)=>{ 
                    toast.success("Assignment updated successfully")
                    toggleManager.reset('additional-dialog')
                    setTimeout(() => {navigate({
                        to: `/classes/${classCode}/assignments`
                    }) },
                    1000)
                },
                onFailure: (err) =>{ toast.error(`${err.msg}`) },
                finally: ()=>{ toggleManager.reset('update-is-loading')},
            }
        )
    }

    function publishDraft() {

        abstractAuthenticatedRequest(
            "get",
            `/api/v1/assignments/${assignment?._id}/publish?isId=true`,
            {},
            {},
            {
                onStart: ()=>{ toggleManager.toggle('update-is-loading')},
                onSuccess: (data)=>{ 
                    toast.success("Assignment published successfully"); 
                    toggleManager.reset('additional-dialog');
                    setTimeout(() => {
                        navigate({ to: `/classes/${classCode}/assignments`})
                    }, 1000)
                },
                onFailure: (err) =>{ toast.error(`${err.msg}`) },
                finally: ()=>{ toggleManager.reset('update-is-loading')},
            }
        )

    }

    function AdditionalDataDialog({ form }: {form: FormikProps<any>}){

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
                    description='Enter the more details to update the assignment'
                >
                    <div className='flex flex-col gap-y-6'>
                        <div className='flex flex-col sm:flex-row  gap-6 sm:gap-4 w-full'>
                            <Input name='startDate' label='Open Date' type='datetime-local' hasValidation />
                            <Input name='endDate' label='Close Date' type='datetime-local' hasValidation />
                        </div>

                        <Input name='maxScore' label='Maximum Score' step={1} type='number' hasValidation />

                        <div className='flex flex-col gap-1'>
                            <div className='w-full flex flex-col gap-2 sm:flex-row justify-between sm:items-center'>
                                <p className='text-blue-700' >Student access</p>
                                <span className='flex gap-1 items-center'>  
                                    <label htmlFor='select-all' className='mb-[2px] text-[0.875rem] font-light'>Select all students</label>
                                    <input type='checkbox' checked={accessList.length == students.length} name='select-all' onChange={(e) => {
                                        if(accessList.length == students.length){
                                            setAccessList([])
                                        } else {
                                            setAccessList(students.map(s => `${s._id}`))
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
                        <div className='flex flex-col-reverse sm:flex-row w-full sm:justify-end gap-2 sm:gap-4 mt-4'>
                            <Button className='w-full sm:!w-[130px]' 
                                variant='neutral' 
                                isDisabled={toggleManager.get('update-is-loading')} type='button' 
                                onClick={()=>{ toggleManager.reset('additional-dialog') }}
                            >Close</Button>
                            <Button className='w-full sm:!w-[130px]' 
                                variant='outline' 
                                isDisabled={!form.isValid} 
                                isLoading={toggleManager.get('update-is-loading')} 
                                onClick={()=> {
                                    form.handleSubmit()
                                }}
                            >Save</Button>
                            {
                                assignment && assignment.meta.isDraft == true &&
                                <Button className='w-full sm:!w-[130px]' 
                                    isDisabled={!form.isValid} 
                                    isLoading={toggleManager.get('update-is-loading')} type='button' 
                                    onClick={publishDraft}
                                >Publish</Button>
                            }
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
                    <h3 className='text-blue-800'>Update Assignment</h3>
                </div>
                <Formik
                    initialValues={updateAssignmentInitialValues}
                    validationSchema={updateAssignmentValidationSchema}
                    onSubmit={handleUpdateAssignment}
                >
                    { form => {

                        useEffect(() => {
                            if(!assignment) return
                            
                            form.setFieldValue('title', assignment.title)
                            form.setFieldValue('instructions', assignment.instructions)
                            form.setFieldValue('maxScore', assignment.maxScore)
                            form.setFieldValue('startDate', dayjs(assignment.startDate).format("YYYY-MM-DDThh:mm"))
                            form.setFieldValue('endDate', dayjs(assignment.endDate).format("YYYY-MM-DDThh:mm"))

                        }, [assignment])
                        return (
                            <>
                                { assignmentsIsLoading && 
                                    <>
                                        <div className='w-full h-full m-auto mt-4'>
                                            <div
                                                className='w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin' 
                                            ></div>
                                        </div>
                                    </> 
                                }

                                { !assignmentsIsLoading && assignment &&
                                    <>
                                        <AdditionalDataDialog form={form} />
                                        <div className='flex flex-col justify-between w-full h-[calc(100%-1rem)]'>
                                            <div className='w-full h-[calc(100%-4rem)] mt-4 overflow-auto'>
                                                <Form className='flex flex-col gap-6 w-full h-full'>
                                                    <Input name='title'  label='Title' hasValidation />
                                                    <div className='flex flex-col mt-1 flex-1'>
                                                        <TextEditor 
                                                            hasValidation 
                                                            name="instructions" 
                                                            editorRef={editorRef} 
                                                            onChange={(_, editor) => {
                                                                editor.update(() => {
                                                                    form.setFieldValue("instructions", $generateHtmlFromNodes(editor, null))
                                                                })
                                                            }} 
                                                        />
                                                    </div>
                                                </Form>
                                            </div>
                                            <div className='flex flex-col sm:flex-row h-28 sm:h-16 flex-shrink-0 justify-end items-center w-full gap-2'>
                                                <div className='flex-1 w-full sm:w-fit flex-shrink-0 flex gap-2 flex-row-reverse justify-between items-center'>
                                                        <div className='flex-shrink-0'>
                                                            <FileUploader buttonVariant='outline' filesHook={filesHook} />
                                                        </div>
                                                        <div className='flex flex-shrink-0 gap-2 overflow-x-auto'>
                                                        { filesHook.files.map((resource, idx) => {
                                                                return (
                                                                    <a className='flex max-w-[200px] justify-between gap-2 p-1 rounded-sm bg-blue-600/20' target='_blank' href={resource.link} key={idx}>
                                                                        <small className='truncate font-extralight'>{resource.title}</small>
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
                                                <Button className='w-full sm:!w-[130px] flex-shrink-0' 
                                                    onClick={()=>{ toggleManager.toggle('additional-dialog')}}
                                                >Continue</Button>
                                            </div>
                                        </div>
                                    </>
                                }
                            </>
                        )
                    }}
                </Formik>
            </div>
        </> 
    )
}


const updateAssignmentInitialValues  = {
    title: "",
    instructions: "",
    maxScore: 0,
    startDate: dayjs().format("YYYY-MM-DDThh:mm"),
    endDate: dayjs().format("YYYY-MM-DDThh:mm"),
}

const updateAssignmentValidationSchema = Yup.object({
    title: Yup.string().required("Title is required").min(4, "Title is too short").max(256, "Title is too long"),
    instructions: Yup.string().required("Instruction is required"),
    maxScore: Yup.number().required("Maximum grade is required").min(0, "Grade cannot be less than 0").max(200, "Grade cannot be greater thatn 200"),
    startDate: Yup.string().required("Start date is required")
        .test("startDate", "Must be in this year", (value) =>{ return new Date(value).getTime() < dayjs().endOf("year").toDate().getTime() }),
    endDate: Yup.string().required("End date is required")
    .test('end-is-after-start', "Must be later than the start date", (endDate, ctx) => {
        const { startDate } = ctx.parent;
        if(startDate){
            return new Date(startDate).getTime() < new Date(endDate).getTime();
        }
    })
})