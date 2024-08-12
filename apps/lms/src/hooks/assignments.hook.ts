import { IAssignmentDoc, IUserDoc } from "@repo/models";
import { makeAuthenticatedRequest } from "@repo/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLMSContext } from "../app";


export function useAssignments(refreshFlag: boolean = true, limit: number = 10, offset:number = 0, filter: Record<string, any> = {}){

    const [ assignments, setAssignments ] = useState<(IAssignmentDoc & { createdBy: IUserDoc, updatedBy: IUserDoc })[]>([]);
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