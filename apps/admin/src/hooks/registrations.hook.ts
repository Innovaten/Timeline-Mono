import { useEffect, useState } from "react";
import { IRegistrationDoc } from "@repo/models";
import { makeAuthenticatedRequest } from "@repo/utils";
import { forEach, set } from "lodash";

export function useRegistrants(
    flag?: boolean, 
    filter: Record<string, any> = { status: { $in: ["Pending", "Approved", "Rejected"] } },
    limit: number = 10, 
    offset: number = 0, 
){
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ registrants, setRegistrants ] = useState<IRegistrationDoc[]>([]);
    const [ count, setCount ] = useState<number>(0);

    useEffect(
        () =>{
            setIsLoading(true);
            makeAuthenticatedRequest(
                "get",
                `/api/v1/registrations?limit=${limit}&offset=${offset}&filter=${JSON.stringify(filter)}`
            )
            .then( res => {
                if(res.status == 200 && res.data.success){
                    setRegistrants(res.data.data.registrations);
                    setCount(res.data.data.count);
                } else {
                    console.log(res.data.error.msg);
                }
                setIsLoading(false);
            })
        },
    typeof flag !== undefined ? [flag] : [])

    return { isLoading, registrants, count }

}

export function useRegistrantsFilter(){
    const [ filterLabel, setFilterLabel ] = useState< "All" | "Pending" | "Approved" | "Rejected" | "Accepted" | "Denied">("All");
    const [ filterChangedFlag, setFilterChangedFlag ] = useState<boolean>(false)

    const resultingFilters = {
        "All": {},
        "Pending": { status: { $in: ["Pending"] } },
        "Approved": { status: { $in: ["Approved"] } },
        "Rejected": { status: { $in: ["Rejected"] } },
        "Accepted": { status: { $in: ["Accepted"] } },
        "Denied": { status: { $in: ["Denied"] } },
    };

    const filterOptions = Object.keys(resultingFilters);
    
    const filter = resultingFilters[filterLabel];

    function changeFilter(arg:  "All" | "Pending" | "Approved" | "Rejected" | "Accepted" | "Denied"){
        setFilterChangedFlag(prev => !prev);
        setFilterLabel(arg);
    };

    return { filter, changeFilter, filterOptions, filterChangedFlag };

}