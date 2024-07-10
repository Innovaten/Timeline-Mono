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