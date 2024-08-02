import { IAssignmentDoc, IUserDoc } from "@repo/models";
import { abstractAuthenticatedRequest, makeAuthenticatedRequest, useLoading } from "@repo/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLMSContext } from "../app";


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
                toast.error(res.data.error?.msg);
            }
        })
        .catch(err => {
            if(err.message){
                toast.error(err.message)
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

export function useAssignment(refreshFlag: boolean = true, specifier: string, isId:boolean = true){

    const [ assignment, setAssignment ] = useState<IAssignmentDoc & { createdBy: IUserDoc, updatedBy:IUserDoc } | null>(null)
    const { isLoading, toggleLoading, resetLoading } = useLoading()

    useEffect( () => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/assignments/${specifier}?isId=${isId}`,
            {},
            {},
            {
                onStart: toggleLoading,
                onSuccess: setAssignment,
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [refreshFlag])


    return { isLoading, assignment }

}


export function useAssignmentStateFilter(){
    const [ filterLabel, setFilterLabel ] = useState<"Public" | "Drafted">("Public");
    const [ filterChangedFlag, setFilterChangedFlag ] = useState<boolean>(false)

    const resultingFilters = {
        "Public": { isDraft: false },
        "Drafted": { isDraft: true },
    };

    const filterOptions = Object.keys(resultingFilters);
    
    const filter = resultingFilters[filterLabel];

    function changeFilter(arg:  "Public" | "Drafted"){
        setFilterChangedFlag(prev => !prev);
        setFilterLabel(arg);
    };

    return { filter, changeFilter, filterOptions, filterChangedFlag };

}