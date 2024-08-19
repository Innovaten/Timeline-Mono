import { useEffect, useState } from "react"
import { useLMSContext } from "../app"
import { abstractAuthenticatedRequest } from "@repo/utils"
import { toast } from "sonner"

export function useClassesResource(){
    const [ classesNum, setClassesNum ] = useState(0)
    const [ isLoading, setIsLoading ] = useState(true)

    const { user } = useLMSContext()

    useEffect(() => {

        abstractAuthenticatedRequest(
            "get",
            `/api/v1/users/${user?._id}/classes/count`,
            {}, {},
            {
                onSuccess: setClassesNum,
                onFailure: (err) => {
                    toast.error(`${err.message ? err.message : err}`)
                },
                finally: ()=> { setIsLoading(false)}
            }
        )

    }, [user?._id])


    return { classesNum, isLoading }

}

export function useAnnouncementsResource(){
    const [ announcementsNum, setAnnouncementsNum ] = useState(0)
    const [ isLoading, setIsLoading ] = useState(true)

    const { user } = useLMSContext()

    useEffect(() => {

        abstractAuthenticatedRequest(
            "get",
            `/api/v1/users/${user?._id}/announcements/count`,
            {}, {},
            {
                onSuccess: setAnnouncementsNum,
                onFailure: (err) => {
                    toast.error(`${err.message ? err.message : err}`)
                },
                finally: ()=> { setIsLoading(false)}
            }
        )

    }, [user?._id])


    return { announcementsNum, isLoading }

}

export function useAssignmentsResource(){
    const [ assignmentsNum, setAssignmentsNum ] = useState(0)
    const [ isLoading, setIsLoading ] = useState(true)

    const { user } = useLMSContext()

    useEffect(() => {

        abstractAuthenticatedRequest(
            "get",
            `/api/v1/users/${user?._id}/assignments/count`,
            {}, {},
            {
                onSuccess: setAssignmentsNum,
                onFailure: (err) => {
                    toast.error(`${err.message ? err.message : err}`)
                },
                finally: ()=> { setIsLoading(false)}
            }
        )

    }, [user?._id])


    return { assignmentsNum, isLoading }

}