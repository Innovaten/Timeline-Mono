import { IAssignmentDoc, IUserDoc } from "@repo/models";
import { abstractAuthenticatedRequest, makeAuthenticatedRequest, useLoading } from "@repo/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLMSContext } from "../app";
import { IResourceDoc } from "@repo/models";
import { IAssignmentSubmissionDoc } from "@repo/models";


export function useAssignments(refreshFlag: boolean = true, limit: number = 10, offset:number = 0, filter: Record<string, any> = {}){

    const [ assignments, setAssignments ] = useState<(IAssignmentDoc & { createdBy: IUserDoc, updatedBy: IUserDoc })[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ count, setCount ] = useState<number>(0);

    const { user } = useLMSContext();

    if(!user) return { assignments: [], isLoading: false, count: 0 }

    const route = user.role == "SUDO" ? "/assignments" : `/users/${user._id}/assignments`
    
    useEffect(() => {
        makeAuthenticatedRequest(
            "get",
            `/api/v1${route}?filter=${JSON.stringify(filter)}&limit=${limit}&offset=${offset}`,
        ).then(res => {
            if(res.status == 200 && res.data.success){
                setAssignments(res.data.data.assignments);
                setCount(res.data.data.count);
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

export function useAssignment(refreshFlag: boolean = true, specifier: string, isId:boolean =true){

    const [ assignment, setAssignment ] = useState< Omit<IAssignmentDoc, "createdBy" | "updatedBy" | "resources"> & { resources?: IResourceDoc[], createdBy?: IUserDoc, updatedBy?: IUserDoc }| null>(null)
    const { isLoading, toggleLoading, resetLoading } = useLoading()

    useEffect( () => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/assignments/${specifier}?isId=${isId}`,
            {},
            {},
            {
                onSuccess: (data) => setAssignment(data.assignment),
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [refreshFlag])


    return { isLoading, assignment }

}

export function useAssignmentSubmission(
    refreshFlag: boolean = true, 
    assignmentSpecifier: string, 
    submissionSpecifier: string,
    isId: boolean =true
){

    const [ submission, setSubmission ] = useState<
        Omit<
            IAssignmentSubmissionDoc, 
            "submittedBy" | "resources" | "gradedBy"
        > & { 
            resources?: IResourceDoc[], 
            submittedBy?: IUserDoc,
            gradedBy?: IUserDoc,
        }
    | null>(null)
    const [assignment, setAssignment] = useState<(
        Omit<
            IAssignmentDoc, 
            "createdBy" | "updatedBy" | "resources"
        > & { 
            resources?: IResourceDoc[], 
            createdBy?: IUserDoc, 
            updatedBy?: IUserDoc 
        }
    | null)>(null)
    const { isLoading, resetLoading } = useLoading()

    useEffect( () => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/assignments/${assignmentSpecifier}/submissions/${submissionSpecifier}?isId=${isId}`,
            {},
            {},
            {
                onSuccess: (data) => {
                    setSubmission(data.submission)
                    setAssignment(data.assignment)
                },
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [refreshFlag])


    return { isLoading, assignment, submission }

}

export function useAssignmentStateFilter(){
    const [ filterLabel, setFilterLabel ] = useState<"Public" | "Drafted">("Public");
    const [ filterChangedFlag, setFilterChangedFlag ] = useState<boolean>(false)

    const resultingFilters = {
        "Public": { "meta.isDraft": false },
        "Drafted": { "meta.isDraft": true  },
    };

    const filterOptions = Object.keys(resultingFilters);
    
    const filter = resultingFilters[filterLabel];

    function changeFilter(arg:  "Public" | "Drafted"){
        setFilterChangedFlag(prev => !prev);
        setFilterLabel(arg);
    };

    return { filter, changeFilter, filterOptions, filterChangedFlag };

}

export function useAssignmentsByClass(refreshFlag: boolean, limit: number = 10, offset:number = 0, filter: Record<string, any> = {}, classSpecifier: string, isId: boolean = true){

    const [ assignments, setAssignments ] = useState<(IAssignmentDoc & { createdBy?: IUserDoc, updatedBy?: IUserDoc })[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ count, setCount ] = useState<number>(0);

    const route = `/classes/${classSpecifier}/assignments`
    
    useEffect(() => {
        makeAuthenticatedRequest(
            "get",
            `/api/v1${route}?isId=${isId}&filter=${JSON.stringify(filter)}&limit=${limit}&offset=${offset}`,
        ).then(res => {
            if(res.status == 200 && res.data.success){
                setAssignments(res.data.data.assignments);
                setCount(res.data.data.count);
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

export function useAssignmentSubmissions(refreshFlag: boolean, limit: number = 10, offset:number = 0, filter: Record<string, any> = {}, assignmentSpecifier: string, isId: boolean = true){

    const [ submissions, setSubmissions ] = useState<(IAssignmentSubmissionDoc & { submittedBy?: IUserDoc })[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ count, setCount ] = useState<number>(0);

    const route = `/assignments/${assignmentSpecifier}/submissions`
    
    useEffect(() => {
        makeAuthenticatedRequest(
            "get",
            `/api/v1${route}?isId=${isId}&filter=${JSON.stringify(filter)}&limit=${limit}&offset=${offset}`,
        ).then(res => {
            if(res.status == 200 && res.data.success){
                setSubmissions(res.data.data.assignmentSubmissions);
                setCount(res.data.data.count);
            } else {
                toast.error(res.data.error?.msg);
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

    return { submissions, isLoading, count };
}

export function useAssignmentSubmissionStatusFilter(){

    const [ filterLabel, setFilterLabel ] = useState<"All"| "Pending"| "Submitted" | "Graded">("All");
    const [ filterChangedFlag, setFilterChangedFlag ] = useState<boolean>(false)

    const resultingFilters = {
        "All": { status: { $in: ["Pending", "Submitted", "Graded"]}, "meta.isDraft": false },
        "Pending": { status: "Pending", "meta.isDraft": false  },
        "Submitted": { status: "Submitted", "meta.isDraft": false  },
        "Graded": { status: "Graded", "meta.isDraft": false  },
    };

    const filterOptions = Object.keys(resultingFilters);
    
    const filter = resultingFilters[filterLabel];

    function changeFilter(arg:  "All" | "Pending" | "Submitted" | "Graded"){
        setFilterChangedFlag(prev => !prev);
        setFilterLabel(arg);
    };

    return { filter, changeFilter, filterOptions, filterChangedFlag };

}