import { useEffect, useState } from "react";
import { IUserDoc } from "@repo/models";
import { makeAuthenticatedRequest } from "@repo/utils";
import { IClassDoc } from "@repo/models";

export function useAdministrators(
    flag?: boolean, 
    filter: Record<string, any> = { role: { $in: ["SUDO", "ADMIN"] } },
    limit: number = 10, 
    offset: number = 0, 
){
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ administrators, setAdministrators ] = useState<(Omit<IUserDoc , "classes"> & { classes?: IClassDoc[]})[] >([]);
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
    const [ filterLabel, setFilterLabel ] = useState< "All" | "Sudo" | "Admin">("All");
    const [ filterChangedFlag, setFilterChangedFlag ] = useState<boolean>(false)

    const resultingFilters = {
        "All": { role: { $in: ["SUDO", "ADMIN"] } },
        "Sudo": { role: { $in: ["SUDO"] } },
        "Admin": { role: { $in: ["ADMIN"] } },
    };

    const filterOptions = Object.keys(resultingFilters);
    
    const filter = resultingFilters[filterLabel];

    function changeFilter(arg:  "All" | "Sudo" | "Admin" ){
        setFilterChangedFlag(prev => !prev);
        setFilterLabel(arg);
    };

    return { filter, changeFilter, filterOptions, filterChangedFlag };

}