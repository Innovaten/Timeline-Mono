import { useEffect, useState } from "react";
import { IUserDoc } from "@repo/models";
import { makeAuthenticatedRequest } from "@repo/utils";

export default function useAdministrators(flag?: boolean, limit: number = 10, offset: number = 0){
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ administrators, setAdministrators ] = useState<IUserDoc[]>([]);
    const [ count, setCount ] = useState<number>(0);

    useEffect(
        () =>{
            makeAuthenticatedRequest(
                "get",
                `/api/v1/users?limit=${limit}&offset=${offset}$filter=${JSON.stringify({ role: { $in: ["SUDO", "ADMIN"] } })}`
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
    flag ? [flag] : [])

    return { isLoading, administrators, count }

}