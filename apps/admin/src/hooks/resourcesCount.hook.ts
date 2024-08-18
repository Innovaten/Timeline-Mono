import { useEffect, useState } from "react";
import { makeAuthenticatedRequest } from "@repo/utils";
import { toast } from "sonner";

export function useClassesCount(
    filter: Record<string,any> = {}
){
    const [ isLoadingClasses, setIsLoadingClasses ] = useState<boolean>(true);
    const [ classesCount, setClassesCount ] = useState<number>(0);

    useEffect(
        () =>{
            setIsLoadingClasses(true);
            makeAuthenticatedRequest(
                "get",
                `/api/v1/classes/count?filter=${JSON.stringify(filter)}`
            )
            .then( res => {
                if(res.status == 200 && res.data.success){
                    setClassesCount(res.data.data);
                } else {
                    console.log(res.data.error.msg);
                    toast.error(res.data.error.msg);
                }
                setIsLoadingClasses(false);
            })
        },[]
)

    return { isLoadingClasses, classesCount }
}


export function useAdminsCount(
){
    const [ adminIsLoading, setAdminIsLoading ] = useState<boolean>(true);
    const [ adminCount, setAdminCount ] = useState<number>(0);

    useEffect(
        () =>{
            setAdminIsLoading(true);
            makeAuthenticatedRequest(
                "get",
                `/api/v1/users/count?filter=${JSON.stringify({role: { $in: ["ADMIN"]}})}`
            )
            .then( res => {
                if(res.status == 200 && res.data.success){
                    setAdminCount(res.data.data);
                } else {
                    console.log(res.data.error.msg);
                    toast.error(res.data.error.msg);
                }
                setAdminIsLoading(false);
            })
        },[]
)

    return { adminIsLoading, adminCount }
}

export function useStudentsCount(
    filter: Record<string,any> = {}
){
    const [ studentIsLoading, setStudentIsLoading ] = useState<boolean>(true);
    const [ studentCount, setStudentCount ] = useState<number>(0);

    useEffect(
        () =>{
            setStudentIsLoading(true);
            makeAuthenticatedRequest(
                "get",
                `/api/v1/users/count?filter=${JSON.stringify({ ...filter, role: { $in: ["STUDENT"]}})}`
            )
            .then( res => {
                if(res.status == 200 && res.data.success){
                    setStudentCount(res.data.data);
                } else {
                    console.log(res.data.error.msg);
                    toast.error(res.data.error.msg);
                }
                setStudentIsLoading(false);
            })
        }, []
)

    return { studentIsLoading, studentCount }
}

export function usePendingCount(
){
    const [ isLoading, setPendingIsLoading ] = useState<boolean>(true);
    const [ pendingCount, setCount ] = useState<number>(0);

    useEffect(
        () =>{
            setPendingIsLoading(true);
            makeAuthenticatedRequest(
                "get",
                `/api/v1/registrations/count?filter=${JSON.stringify({status: { $in: ["Pending"]}})}`
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

    return { isLoading, pendingCount }
}
export function useAnnouncementsCount(
    refreshFlag: boolean = true,  
){
    const [ isLoadingAnnouncement, setIsLoadingAnnouncement ] = useState<boolean>(true);
    const [ announcementsCount, setAnnouncementsCount ] = useState<number>(0);
    
    useEffect(
        () =>{
            setIsLoadingAnnouncement(true);
            makeAuthenticatedRequest(
                "get",
                `/api/v1/announcements/count?filter={}`
            )
            .then( res => {
                if(res.status == 200 && res.data.success){
                    setAnnouncementsCount(res.data.data);
                } else {
                    console.log(res.data.error.msg);
                    toast.error(res.data.error.msg);
                }
                setIsLoadingAnnouncement(false);
            })
            .catch(err => {
                if(err.message){
                    toast.error(err.message)
                } else {
                    toast.error(`${err}`)
                }
            })
        },[refreshFlag]
)

    return { isLoadingAnnouncement, announcementsCount }
}