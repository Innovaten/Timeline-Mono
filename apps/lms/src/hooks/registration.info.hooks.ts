import { useEffect, useState } from "react";
import { IRegistrationDoc } from "@repo/models";
import { makeUnauthenticatedRequest } from "@repo/utils";

export function useRegistrant(
    id : string,
){
    const [ registrant, setRegistrant ] = useState<IRegistrationDoc>({} as IRegistrationDoc);

    useEffect(
        () =>{
            makeUnauthenticatedRequest(
                "get",
                `/api/v1/registrations/user?_id=${id}`
            ).then( res => {
                if(res.status == 200 && res.data.success){
                    setRegistrant(res.data.data);
                } else {
                    console.log(res.data.error.msg);
                }
            })
        },
    [id])

    return { registrant }

}
