import { IAnnouncementDoc, IUserDoc } from "@repo/models";
import { abstractAuthenticatedRequest, makeAuthenticatedRequest, useLoading } from "@repo/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLMSContext } from "../app";


export function useAnnouncements(refreshFlag: boolean = true){

    const [ announcements, setAnnouncements ] = useState<(IAnnouncementDoc & { createdBy: IUserDoc, updatedBy: IUserDoc })[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ count, setCount ] = useState<number>(0);

    useEffect(() => {
        makeAuthenticatedRequest(
            "get",
            `/api/v1/users/announcements`,
        ).then(res => {
            if(res.status == 200 && res.data.success){
                setAnnouncements(res.data.data);
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

    return { announcements, isLoading, count };
}

export function useAnnouncement(refreshFlag: boolean = true, specifier: string, isId:boolean = true){

    const [ announcement, setAnnouncement ] = useState<IAnnouncementDoc & { createdBy: IUserDoc, updatedBy:IUserDoc } | null>(null)
    const { isLoading, resetLoading } = useLoading()

    useEffect( () => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/announcements/${specifier}?isId=${isId}`,
            {},
            {},
            {
                onSuccess: (data)=>{ setAnnouncement(data) },
                onFailure: (err) => {toast.error(`${err.msg}`)},
                finally: resetLoading
            }
        )

    }, [refreshFlag])


    return { isLoading, announcement }

}