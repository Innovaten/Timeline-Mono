import { useEffect, useState } from "react";
import { useLMSContext } from "../app";
import { IAnnouncementDoc, IAnnouncementSetDoc, IAssignmentDoc, IAssignmentSet, IClassDoc, IUserDoc } from "@repo/models";
import { abstractAuthenticatedRequest, useLoading } from "@repo/utils";
import { toast } from "sonner";

export function useClasses(
    flag: boolean, 
    filter: Record<string, any> = {},
    limit: number = 10, 
    offset: number = 0, 
){
    const  { user } = useLMSContext()
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ classes, setClasses ] = useState<IClassDoc[]>([]);
    const [ count, setCount ] = useState<number>(0);

    if(!user) return { isLoading: false, classes: [], count: 0 }

    const route = `/api/v1/users/${user._id}/classes`

    useEffect(
        () => {
            setIsLoading(true);
            abstractAuthenticatedRequest(
                "get",
                `${route}?limit=${limit}&offset=${offset}&filter=${JSON.stringify(filter)}`,
                {}, {},
                {
                    onSuccess: (data) => {
                        setClasses(data.classes);
                        setCount(data.count);
                    },
                    onFailure: (err) => {
                        toast.error(`${err.message ? err.message : err}`)
                    },
                    finally: () => { setIsLoading(false) }
                }
            )
        },
    [flag])

    return { isLoading, classes, count }
}

export function useClass(flag: boolean, specifier: string, isId:boolean) {


    const [ thisClass, setClass ] = useState<
        Omit<IClassDoc, "createdBy" | "administrators" | "announcementSet"> & { 
            createdBy: IUserDoc, 
            administrators: IUserDoc[], 
            announcementSet: IAnnouncementSetDoc & { announcements: IAnnouncementDoc[] },
            assignmentSet: IAssignmentSet & { assignments: IAssignmentDoc[] }} | null>(null)
    const { isLoading, toggleLoading, resetLoading} = useLoading();


    useEffect(() => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/classes/${specifier}?isId=${( isId ?? true )}`,
            {},
            {},
            {
                onStart: toggleLoading,
                onSuccess: (data) => {setClass(data)},
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [flag])

    return { thisClass, isLoading}
}