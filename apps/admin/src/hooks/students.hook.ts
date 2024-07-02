import { useEffect, useState } from "react";
import { IUserDoc } from "@repo/models";
import { makeAuthenticatedRequest } from "@repo/utils";

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

export function useModeOfClassFilter(){
    const [ filterLabel, setFilterLabel ] = useState<"All" | "In-Person" | "Online">("All");
    const [ filterChangedFlag, setFilterChangedFlag ] = useState<boolean>(false)

    const resultingFilters = {
        "All": { modeOfClass: { $in: ["In-Person", "Online"] } },
        "In-Person": { modeOfClass: { $in: ["In-Person"] } },
        "Online": { modeOfClass: { $in: ["Online"] } },
    };

    const filterOptions = Object.keys(resultingFilters);
    
    const filter = resultingFilters[filterLabel];

    function changeFilter(arg:  "All" | "In-Person" | "Online"){
        setFilterChangedFlag(prev => !prev);
        setFilterLabel(arg);
    };

    return { filter, changeFilter, filterOptions, filterChangedFlag };

}
