import { useEffect, useState } from "react";
import { makeAuthenticatedRequest } from "@repo/utils";
import { toast } from "sonner";

export function useClassesCount(
){
    const [ isLoadingClasses, setIsLoadingClasses ] = useState<boolean>(true);
    const [ classesCount, setClassesCount ] = useState<number>(0);

    useEffect(
        () =>{
            setIsLoadingClasses(true);
            makeAuthenticatedRequest(
                "get",
                `/api/v1/classes/count`
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
        },
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
                `/api/v1/users/admins/count`
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
        },
)

    return { adminIsLoading, adminCount }
}

export function useStudentsCount(
){
    const [ studentIsLoading, setStudentIsLoading ] = useState<boolean>(true);
    const [ studentCount, setStudentCount ] = useState<number>(0);

    useEffect(
        () =>{
            setStudentIsLoading(true);
            makeAuthenticatedRequest(
                "get",
                `/api/v1/registrations/students/count`
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
        },
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
                `/api/v1/registrations/pending/count`
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
        },
)

    return { isLoading, pendingCount }
}