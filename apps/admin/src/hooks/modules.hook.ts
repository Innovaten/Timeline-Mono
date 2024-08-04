import { IModuleDoc, IUserDoc } from "@repo/models";
import { abstractAuthenticatedRequest, makeAuthenticatedRequest, useLoading } from "@repo/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export function useModules(refreshFlag: boolean = true,limit: number = 10, offset:number = 0, filter: Record<string, any> = {}){

    const [ modules, setModules ] = useState<(IModuleDoc & { createdBy: IUserDoc, updatedBy: IUserDoc })[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ count, setCount ] = useState<number>(0);

    const { user, ...actualFilter} = filter

    const route = "/modules"
    useEffect(() => {
        makeAuthenticatedRequest(
            "get",
            `/api/v1${route}?filter=${JSON.stringify(actualFilter)}&limit=${limit}&offset=${offset}`,
        ).then(res => {
            if(res.status == 200 && res.data.success){
                setModules(res.data.data.modules);
                setCount(res.data.data.count);
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

    const [ module, setModule ] = useState<IModuleDoc & { createdBy: IUserDoc, updatedBy:IUserDoc } | null>(null)
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


export function useModuleStateFilter(){
    const [ filterLabel, setFilterLabel ] = useState<"Public" | "Deleted">("Public");
    const [ filterChangedFlag, setFilterChangedFlag ] = useState<boolean>(false)

    const resultingFilters = {
        "Public": { "meta.isDeleted": { $eq: false }},
        "Deleted": { "meta.isDeleted": { $eq: true }},
    };

    const filterOptions = Object.keys(resultingFilters);
    
    const filter = resultingFilters[filterLabel];

    function changeFilter(arg:  "Public" | "Deleted"){
        setFilterChangedFlag(prev => !prev);
        setFilterLabel(arg);
    };

    return { filter, changeFilter, filterOptions, filterChangedFlag };

}