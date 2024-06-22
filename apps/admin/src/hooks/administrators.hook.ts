import { useEffect, useState } from "react";
import { IUserDoc } from "@repo/models";
import { makeAuthenticatedRequest } from "@repo/utils";

export default function useAdministrators(
    flag?: boolean, 
    filter: Record<string, any> = { role: { $in: ["SUDO", "ADMIN"] } },
    limit: number = 10, 
    offset: number = 0, 
){
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ administrators, setAdministrators ] = useState<IUserDoc[]>([]);
    const [ count, setCount ] = useState<number>(0);

    useEffect(
        () =>{
            setIsLoading(true);
            makeAuthenticatedRequest(
                "get",
                `/api/v1/users?limit=${limit}&offset=${offset}&filter=${JSON.stringify(filter)}`
            )
            .then( res => {
                if(res.status == 200 && res.data.success){
                    setAdministrators(res.data.data.users);
                    setCount(res.data.data.count);
                } else {
                    console.log(res.data.error.msg);
                }
                setIsLoading(false);
            })
        },
    typeof flag !== undefined ? [flag] : [])

    return { isLoading, administrators, count }

}

export function useAdministratorsFilter(){
    const [ filterLabel, setFilterLabel ] = useState< "All" | "Super Users" | "Administrators">("All");
    const [ filterChangedFlag, setFilterChangedFlag ] = useState<boolean>(false)

    const resultingFilters = {
        "All": { role: { $in: ["SUDO", "ADMIN"] } },
        "Super Users": { role: { $in: ["SUDO"] } },
        "Administrators": { role: { $in: ["ADMIN"] } },
    };

    const filterOptions = Object.keys(resultingFilters);
    
    const filter = resultingFilters[filterLabel];

    function changeFilter(arg:  "All" | "Super Users" | "Administrators" ){
        setFilterChangedFlag(prev => !prev);
        setFilterLabel(arg);
    };

    return { filter, changeFilter, filterOptions, filterChangedFlag };

}