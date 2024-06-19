import { IRegistrationDoc } from "@repo/models";
import { makeAuthenticatedRequest } from "@repo/utils";
import { useEffect, useState } from "react";

export function useRegistrations(refreshFlag?: boolean){

    
    const [ registrations, setRegistrations ] = useState<IRegistrationDoc[]>([])
    const [ isLoading, setIsLoading ] = useState<boolean>(true)
    
    useEffect(() => {
        makeAuthenticatedRequest( 
            'get', 
            '/api/v1/registrations?offset=0&limit=10',
        )
        .then(res => {
            const regData = res.data.data as IRegistrationDoc[];
            setRegistrations(regData);
            setIsLoading(false)
        })

    }, refreshFlag ? [refreshFlag] : [])

    return { registrations, isLoading }

}   