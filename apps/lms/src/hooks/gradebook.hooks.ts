import { IAssignmentDoc, IAssignmentSubmissionDoc, IUserDoc } from "@repo/models";
import { makeAuthenticatedRequest} from "@repo/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export function useGrades(refreshFlag: boolean = true, specifier: string, isId: boolean = true, classCode: string){

    const [ assignmentGrades, setAssignmentGrades ] = useState<(IAssignmentSubmissionDoc & { submittedBy: IUserDoc, assignment: IAssignmentDoc })[]>([]);
    // const [ quizGrades, setQuizGrades ] = useState<(IQuizSubmissionDoc & { submittedBy: IUserDoc, quiz: IQuizDoc })[]>([]);
    const [ quizGrades, setQuizGrades ] =  useState<(IAssignmentSubmissionDoc & { submittedBy: IUserDoc, assignment: IAssignmentDoc })[]>([]);
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
