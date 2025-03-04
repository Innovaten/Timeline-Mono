import { AssignmentSubmissionStatusType, IAssignmentDoc, IAssignmentSubmissionDoc, IResourceDoc, IUserDoc } from "@repo/models";
import { abstractAuthenticatedRequest, makeAuthenticatedRequest, useLoading } from "@repo/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLMSContext } from "../app";


export function useAssignments(refreshFlag: boolean = true, limit: number = 10, offset:number = 0, filter: Record<string, any> = {}){

    const [ assignments, setAssignments ] = useState<(IAssignmentDoc & { status?: AssignmentSubmissionStatusType ,createdBy: IUserDoc, updatedBy: IUserDoc })[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ count, setCount ] = useState<number>(0);

    const { user } = useLMSContext()

    const route = `/users/${user?._id}/assignments`
    
    useEffect(() => {
        makeAuthenticatedRequest(
            "get",
            `/api/v1${route}?filter=${JSON.stringify(filter)}&limit=${limit}&offset=${offset}`,
        ).then(res => {
            if(res.status == 200 && res.data.success){
                setAssignments(res.data.data);
                setCount(res.data.data.length);
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

    return { assignments, isLoading, count };

}


export function useAssignmentSubmissionStatusFilter(){

    const [ filterLabel, setFilterLabel ] = useState<"All"| "Pending"| "Submitted" | "Graded">("All");
    const [ filterChangedFlag, setFilterChangedFlag ] = useState<boolean>(false)

    const resultingFilters = {
        "All": { status: { $in: ["Pending", "Submitted", "Graded"]} },
        "Pending": { status: "Pending" },
        "Submitted": { status: "Submitted" },
        "Graded": { status: "Graded" },
    };

    const filterOptions = Object.keys(resultingFilters);
    
    const filter = resultingFilters[filterLabel];

    function changeFilter(arg:  "All" | "Pending" | "Submitted" | "Graded"){
        setFilterChangedFlag(prev => !prev);
        setFilterLabel(arg);
    };

    return { filter, changeFilter, filterOptions, filterChangedFlag };

}

export function useAssignment(refreshFlag: boolean = true, specifier: string, isId:boolean =true){

    const [ assignment, setAssignment ] = useState< Omit<IAssignmentDoc, "createdBy" | "updatedBy" | "resources"> & { resources?: IResourceDoc[], createdBy?: IUserDoc, updatedBy?: IUserDoc, status?: AssignmentSubmissionStatusType }| null>(null)
    const [ submission, setSubmission ] = useState< Omit<IAssignmentSubmissionDoc, "createdBy" | "gradedBy" | "resources"> & {createdBy?: IUserDoc, resources?: IResourceDoc[], gradedBy?: IUserDoc}| null>(null)
    const { isLoading, resetLoading } = useLoading()

    useEffect( () => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/assignments/${specifier}?isId=${isId}`,
            {},
            {},
            {
                onSuccess: (data) => {
                    setAssignment(data.assignment)
                    setSubmission(data.submission)
                },
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [refreshFlag])


    return { isLoading, assignment, submission }

}

export function useClassAssignments(
    refreshFlag: boolean = true, 
    classSpecifier: string, 
    isId:boolean =true
){

    const [ assignments, setAssignments ] = useState< (Omit<IAssignmentDoc, "createdBy" | "updatedBy" | "resources"> & { resources?: IResourceDoc[], createdBy?: IUserDoc, updatedBy?: IUserDoc, status: AssignmentSubmissionStatusType } )[]| null>(null)
    const [ count, setCount ] = useState<number>(0);
    const { isLoading, resetLoading } = useLoading()

    useEffect( () => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/classes/${classSpecifier}/assignments?isId=${isId}`,
            {},
            {},
            {
                onSuccess: (data) => {
                    setAssignments(data.assignments)
                    setCount(data.count)
                },
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [refreshFlag])


    return { isLoading, assignments, count }

}