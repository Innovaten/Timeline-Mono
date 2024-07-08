import { useEffect, useState } from "react";
import { IRegistrationDoc } from "@repo/models";
import { makeUnauthenticatedRequest } from "@repo/utils";
import { toast } from "sonner";

export function useRegistrant(
    id : string,
){
    const [ registrant, setRegistrant ] = useState<IRegistrationDoc>({} as IRegistrationDoc);

    useEffect(
        () =>{
            makeUnauthenticatedRequest(
                "get",
                `/api/v1/registrations/${id}`
            ).then( res => {
                if(res.status == 200 && res.data.success){
                    setRegistrant(res.data.data);
                } else {
                    console.log(res.data.error.msg);
                    toast.error(res.data.error.msg)
                }
            })
        },
    [id])

    return { registrant }

}
