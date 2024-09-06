import { useEffect, useState } from "react";
import { IAssignmentDoc, IAssignmentSubmissionDoc, IUserDoc } from "@repo/models";
import { makeAuthenticatedRequest } from "@repo/utils";
import { toast } from "sonner";

export function useStudents(
    flag?: boolean, 
    filter?: Record<string, any>,
    limit: number = 10, 
    offset: number = 0, 
){
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ students, setStudents ] = useState<IUserDoc[]>([]);
    const [ count, setCount ] = useState<number>(0);

    const finalFilter = {
        role: { $in: [ "STUDENT" ] },
        ...(filter ? filter : {}) 
    }

    useEffect(
        () =>{
            setIsLoading(true);
            makeAuthenticatedRequest(
                "get",
                `/api/v1/users?limit=${limit}&offset=${offset}&filter=${JSON.stringify(finalFilter)}`
            )
            .then( res => {
                if(res.status == 200 && res.data.success){
                    setStudents(res.data.data.users);
                    setCount(res.data.data.count);
                } else {
                    console.log(res.data.error.msg);
                }
                setIsLoading(false);
            })
        },
    typeof flag !== undefined ? [flag] : [])

    return { isLoading, students, count }

}

export function useStudentsInClass(flag: boolean, specifier: string, isId: boolean = true){

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ students, setStudents ] = useState<IUserDoc[]>([]);

    useEffect(
        () =>{
            setIsLoading(true);
            makeAuthenticatedRequest(
                "get",
                `/api/v1/classes/${specifier}/students?isId=${isId}`
            )
            .then( res => {
                if(res.status == 200 && res.data.success){
                    setStudents(res.data.data);
                } else {
                    console.log(res.data.error.msg);
                }
                setIsLoading(false);
            })
        },
    [flag])

    return { isLoading, students }

}

export function useGrades(refreshFlag: boolean = true, specifier: string, isId: boolean = true, classCode: string){

    const [ assignmentGrades, setAssignmentGrades ] = useState<(IAssignmentSubmissionDoc & { submittedBy: IUserDoc, assignment: IAssignmentDoc })[]>([]);
    // const [ quizGrades, setQuizGrades ] = useState<(IQuizSubmissionDoc & { submittedBy: IUserDoc, quiz: IQuizDoc })[]>([]);
    const [ quizGrades, setQuizGrades ] =  useState<(IAssignmentSubmissionDoc & { submittedBy: IUserDoc, assignment: IAssignmentDoc })[]>([])
    const [ isLoading, setIsLoading ] = useState<boolean>(true);


    const route = `/users/${specifier}/gradebook/${classCode}?isId=${isId}`
    
    useEffect(() => {
        makeAuthenticatedRequest(
            "get",
            `/api/v1${route}`,
        ).then(res => {
            if(res.status == 200 && res.data.success){
                setAssignmentGrades(res.data.data.assignments);
                setQuizGrades(res.data.data.quizzes)
            } else {
                toast.error(`${res.data.error?.msg}`);
            }
        })
        .catch(err => {
            if(err.message){
                toast.error(`${err.message}`)
            } else {
                toast.error(`${err}`)
            }
        })
        .finally(() => {
            setIsLoading(false);
        })

    }, [refreshFlag])

    return { assignmentGrades, quizGrades, isLoading };

}
