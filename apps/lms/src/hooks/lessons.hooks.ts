import { ICompletedLessonDoc, ILessonDoc, IResourceDoc, IUserDoc } from "@repo/models";
import { abstractAuthenticatedRequest, makeAuthenticatedRequest, useLoading } from "@repo/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export function useLessons(refreshFlag: boolean = true,limit: number = 10, offset:number = 0, filter: Record<string, any> = {}){

    const [ lessons, setLessons ] = useState<(ILessonDoc & { createdBy: IUserDoc, updatedBy: IUserDoc })[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ count, setCount ] = useState<number>(0);

   
    

    const route = "/lessons"
    useEffect(() => {
        makeAuthenticatedRequest(
            "get",
            `/api/v1${route}?filter=${JSON.stringify(filter)}&limit=${limit}&offset=${offset}`,
        ).then(res => {
            if(res.status == 200 && res.data.success){
                console.log(res.data.data)
                setLessons(res.data.data);
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

    return { lessons, isLoading, count };

}

export function useLesson(refreshFlag: boolean = true, specifier: string){

    const [ lesson, setLesson ] = useState<Omit<ILessonDoc, "createdBy" | "updatedBy" | "resources"> & { createdBy: IUserDoc, updatedBy:IUserDoc,  resources?: IResourceDoc[] } | null>(null)
    const { isLoading, toggleLoading, resetLoading } = useLoading()
    
    useEffect( () => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/lessons/lms/${specifier}`,
            {},
            {},
            {
                onStart: toggleLoading,
                onSuccess: setLesson,
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [refreshFlag])

    return { isLoading, lesson }
}


export function useCompletedLessons(refreshFlag: boolean = true, userId: string){
    
    const [ completedLessons, setCompletedLessons ] = useState<(ILessonDoc & { createdBy: IUserDoc, updatedBy: IUserDoc })[]>([]);
    const { isLoading, toggleLoading, resetLoading } = useLoading()

    
    
    useEffect( () => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/users/${userId}/completed-lessons`,
            {},
            {},
            {
                onStart: toggleLoading,
                onSuccess: setCompletedLessons,
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [refreshFlag])
    
    return { isLoading, completedLessons }
    
}