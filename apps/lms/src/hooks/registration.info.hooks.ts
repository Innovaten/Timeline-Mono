import { useEffect, useState } from "react";
import { IClassDoc, IRegistrationDoc } from "@repo/models";
import { makeUnauthenticatedRequest } from "@repo/utils";
import { toast } from "sonner";

export function useRegistrant(
    id : string,
){
    const [ registrant, setRegistrant ] = useState< Omit<IRegistrationDoc, "approvedClasses" > & { approvedClasses: IClassDoc[] } >({} as any);

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
