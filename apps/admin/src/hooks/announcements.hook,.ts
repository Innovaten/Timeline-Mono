import { IAnnouncementDoc, IUserDoc } from "@repo/models";
import { abstractAuthenticatedRequest, makeAuthenticatedRequest, useLoading } from "@repo/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLMSContext } from "../app";


export function useAnnouncements(refreshFlag: boolean = true, limit: number = 10, offset:number = 0, filter: Record<string, any> = {}){

    const [ announcements, setAnnouncements ] = useState<(IAnnouncementDoc & { createdBy: IUserDoc, updatedBy: IUserDoc })[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ count, setCount ] = useState<number>(0);

    const { user } = useLMSContext();

    if(!user) return { announcements: [], isLoading: false, count: 0 }

    const route = user.role == "SUDO" ? "/announcements" : `/users/${user._id}/announcements`
    
    useEffect(() => {
        makeAuthenticatedRequest(
            "get",
            `/api/v1${route}?filter=${JSON.stringify(filter)}&limit=${limit}&offset=${offset}`,
        ).then(res => {
            if(res.status == 200 && res.data.success){
                setAnnouncements(res.data.data.announcements);
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

    return { announcements, isLoading, count };

}

export function useAnnouncement(refreshFlag: boolean = true, specifier: string, isId:boolean = true){

    const [ announcement, setAnnouncement ] = useState<IAnnouncementDoc & { createdBy: IUserDoc, updatedBy:IUserDoc } | null>(null)
    const { isLoading, toggleLoading, resetLoading } = useLoading()

    useEffect( () => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/announcements/${specifier}?isId=${isId}`,
            {},
            {},
            {
                onStart: toggleLoading,
                onSuccess: setAnnouncement,
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [refreshFlag])


    return { isLoading, announcement }

}


export function useAnnouncementsByClass(refreshFlag: boolean = true, classCode: string, limit: number = 10, offset:number = 0, filter: Record<string, any> = {}){

    const [ announcements, setAnnouncements ] = useState<(IAnnouncementDoc & { createdBy: IUserDoc, updatedBy:IUserDoc })[]>([])
    const { isLoading, toggleLoading, resetLoading } = useLoading()

    useEffect( () => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/classes/${classCode}/announcements?isId=false`,
            {},
            {},
            {
                onStart: toggleLoading,
                onSuccess: setAnnouncements,
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [refreshFlag])


    return { isLoading, announcements }

}

export function useAnnouncementsCountByClass(refreshFlag: boolean = true, classCode: string, limit: number = 10, offset:number = 0, filter: Record<string, any> = {}){

    const [ count, setCount ] = useState<number>(0)
    const { isLoading, toggleLoading, resetLoading } = useLoading()

    useEffect( () => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/classes/${classCode}/announcements/count?isId=false`,
            {},
            {},
            {
                onStart: toggleLoading,
                onSuccess: setCount,
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [refreshFlag])


    return { isLoading, count }

}
export function useAnnouncementStateFilter(){
    const [ filterLabel, setFilterLabel ] = useState<"Public" | "Drafted" | "Deleted">("Public");
    const [ filterChangedFlag, setFilterChangedFlag ] = useState<boolean>(false)

    const resultingFilters = {
        "Public": { isDraft: false, "meta.isDeleted": { $eq: false }},
        "Drafted": { isDraft: true, "meta.isDeleted": { $eq: false }},
        "Deleted": { "meta.isDeleted": { $eq: true }},
    };

    const filterOptions = Object.keys(resultingFilters);
    
    const filter = resultingFilters[filterLabel];

    function changeFilter(arg:  "Public" | "Drafted" | "Deleted"){
        setFilterChangedFlag(prev => !prev);
        setFilterLabel(arg);
    };

    return { filter, changeFilter, filterOptions, filterChangedFlag };

}