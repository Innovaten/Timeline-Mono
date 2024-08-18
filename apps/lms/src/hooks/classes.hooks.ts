import {  useEffect,useState } from "react";
import { IClassDoc } from "@repo/models";
import { makeAuthenticatedRequest } from "@repo/utils";
import { toast } from "sonner";

export function useClasses( id : string){

    const [classes, setClasses] = useState<IClassDoc[]>([]);
    const [classCount, setClassCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(
        () =>{
            makeAuthenticatedRequest(
                "get",
                `/api/v1/users/${id}/classes`,
            ).then( res => {
                if(res.status == 200 && res.data.success){
                    console.log(res.data.data.classes);
                    setClasses(res.data.data.classes);
                    setClassCount(res.data.data.count);
                } else {
                    console.log(res.data.error.msg);
                    toast.error(res.data.error.msg)
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
        },
    [id])
    

    return { classes, classCount, isLoading }

}
