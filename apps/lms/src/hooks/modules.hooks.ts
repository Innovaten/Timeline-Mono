import { ICompletedModuleDoc, IModuleDoc, IResourceDoc, IUserDoc } from "@repo/models";
import { abstractAuthenticatedRequest, makeAuthenticatedRequest, useLoading } from "@repo/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export function useModules(refreshFlag: boolean = true,limit: number = 10,  offset:number = 0, classCode: string, filter: Record<string, any> = {}){

    const [ modules, setModules ] = useState<(IModuleDoc & { createdBy: IUserDoc, updatedBy: IUserDoc })[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ count, setCount ] = useState<number>(0);
    const { user, ...actualFilter} = filter

    const route = "/modules"
    useEffect(() => {
        makeAuthenticatedRequest(
            "get",
            `/api/v1${route}/${classCode}/modules?filter=${JSON.stringify(actualFilter)}&limit=${limit}&offset=${offset}`,
        ).then(res => {
            if(res.status == 200 && res.data.success){
                setModules(res.data.data);
                setCount(res.data.data.length);
            } else {
                toast.error(res.data.error?.msg);
            }
        })
        .catch(err => {
            if(err.message){
                toast.error(err.message)
            } else {
                toast.error(`${err}`)
            }
        })
        .finally(() => {
            setIsLoading(false);
        })

    }, [refreshFlag])

    return { modules, isLoading, count };

}

export function useModule(refreshFlag: boolean = true, specifier: string, isId:boolean = true){

    const [ module, setModule ] = useState< Omit <IModuleDoc, "createdBy" | "updatedBy" | "resources"> & { createdBy: IUserDoc, updatedBy:IUserDoc,  resources?: IResourceDoc[] } | null>(null)
    const { isLoading, toggleLoading, resetLoading } = useLoading()

    useEffect( () => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/modules/${specifier}?isId=${isId}`,
            {},
            {},
            {
                onStart: toggleLoading,
                onSuccess: setModule,
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [refreshFlag])


    return { isLoading, module }

}



export function classModuleCount(classCode: string){
    const [ isLoading, setPendingIsLoading ] = useState<boolean>(true);
    const [ count, setCount ] = useState<number>(0);

    useEffect(
        () =>{
            setPendingIsLoading(true);
            makeAuthenticatedRequest(
                "get",
                `/api/v1/modules/${classCode}/count?filter=${JSON.stringify({})}`
            )
            .then( res => {
                if(res.status == 200 && res.data.success){
                    setCount(res.data.data);
                } else {
                    console.log(res.data.error.msg);
                    toast.error(res.data.error.msg);
                }
                setPendingIsLoading(false);
            })
        }, []
)

    return { isLoading, count }
}

export function useCompletedModules(refreshFlag: boolean = true, userId: string){
    
    const [ completedModules, setCompletedModules ] = useState<(IModuleDoc & { createdBy: IUserDoc, updatedBy: IUserDoc })[]>([]);
    const { isLoading, toggleLoading, resetLoading } = useLoading()
    
    useEffect( () => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/users/${userId}/completed-modules`,
            {},
            {},
            {
                onStart: toggleLoading,
                onSuccess: setCompletedModules,
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [refreshFlag])

    return { isLoading, completedModules }
    
}