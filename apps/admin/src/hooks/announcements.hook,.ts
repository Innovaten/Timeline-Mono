import { IAnnouncementDoc, IUserDoc } from "@repo/models";
import { makeAuthenticatedRequest } from "@repo/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export function useAnnouncements(refreshFlag: boolean = true,limit: number = 10, offset:number = 0, filter: Record<string, any> = {}){

    const [ announcements, setAnnouncments ] = useState<(IAnnouncementDoc & { createdBy: IUserDoc, updatedBy: IUserDoc })[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ count, setCount ] = useState<number>(0);

    useEffect(() => {
        makeAuthenticatedRequest(
            "get",
            `/api/v1/announcements?filter=${JSON.stringify(filter)}&limit=${limit}&offset=${offset}`,
        ).then(res => {
            if(res.status == 200 && res.data.success){
                setAnnouncments(res.data.data.announcements);
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

