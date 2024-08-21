import { useEffect, useState } from "react";
import { abstractAuthenticatedRequest, makeAuthenticatedRequest, useLoading } from "@repo/utils";
import { IClassDoc, IUserDoc, IAssignmentDoc, IAnnouncementDoc, IAnnouncementSetDoc, IAssignmentSet } from "@repo/models";
import { toast } from "sonner";
import { useLMSContext } from "../app";
import { IAssignment } from "@repo/models";

export function useClasses(
    flag?: boolean, 
    filter: Record<string, any> = {},
    limit: number = 10, 
    offset: number = 0, 
){
    const  { user } = useLMSContext()
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ classes, setClasses ] = useState<IClassDoc[]>([]);
    const [ count, setCount ] = useState<number>(0);

    if(!user) return { isLoading: false, clases: [], count: 0 }

    const route = user.role == "SUDO" ? '/api/v1/classes' : `/api/v1/users/${user._id}/classes`

    useEffect(
        () =>{
            setIsLoading(true);
            makeAuthenticatedRequest(
                "get",
                `${route}?limit=${limit}&offset=${offset}&filter=${JSON.stringify(filter)}`
            )
            .then( res => {
                if(res.status == 200 && res.data.success){
                    setClasses(res.data.data.classes);
                    setCount(res.data.data.count);
                } else {
                    console.log(res.data.error.msg);
                }
                setIsLoading(false);
            })
        },
    typeof flag !== undefined ? [flag] : [])

    return { isLoading, classes, count }
}


export function useClassesModeOfClassFilter(){
    const [ filterLabel, setFilterLabel ] = useState<"All" | "In-Person" | "Online">("All");
    const [ filterChangedFlag, setFilterChangedFlag ] = useState<boolean>(false)

    const resultingFilters = {
        "All": { modeOfClass: { $in: ["In-Person", "Online"] } },
        "In-Person": { modeOfClass: { $in: ["In-Person"] } },
        "Online": { modeOfClass: { $in: ["Online"] } },
    };

    const filterOptions = Object.keys(resultingFilters);
    
    const filter = resultingFilters[filterLabel];

    function changeFilter(arg:  "All" | "In-Person" | "Online"){
        setFilterChangedFlag(prev => !prev);
        setFilterLabel(arg);
    };

    return { filter, changeFilter, filterOptions, filterChangedFlag };

}

export function useClassesStatusFilter(){
    const [ filterLabel, setFilterLabel ] = useState<"All" | "Active" | "Suspended">("All");
    const [ filterChangedFlag, setFilterChangedFlag ] = useState<boolean>(false)

    const resultingFilters = {
        "All": { status: { $in: ["Active", "Suspended"] } },
        "Active": { status: { $in: ["Active"] } },
        "Suspended": { status: { $in: ["Suspended"] } },
    };

    const filterOptions = Object.keys(resultingFilters);
    
    const filter = resultingFilters[filterLabel];

    function changeFilter(arg:  "All" | "Active" | "Suspended"){
        setFilterChangedFlag(prev => !prev);
        setFilterLabel(arg);
    };

    return { filter, changeFilter, filterOptions, filterChangedFlag };

}

export function useClassesAssignedStatusFilter(){
    const [ filterLabel, setFilterLabel ] = useState<"All" | "Assigned" | "Unassigned">("All");
    const [ filterChangedFlag, setFilterChangedFlag ] = useState<boolean>(false)

    const resultingFilters = {
        "All": {},
        "Assigned": { administrators: { $exists: true, $not: { $size: 0 }} },
        "Unassigned": { administrators: { $exists: true,  $size: 0 }  },
    };

    const filterOptions = Object.keys(resultingFilters);
    
    const filter = resultingFilters[filterLabel];

    function changeFilter(arg:  "All" | "Assigned" | "Unassigned"){
        setFilterChangedFlag(prev => !prev);
        setFilterLabel(arg);
    };

    return { filter, changeFilter, filterOptions, filterChangedFlag };

}

export function useClass(flag: boolean, specifier: string, isId:boolean) {


    const [ thisClass, setClass ] = useState<
        Omit<IClassDoc, "createdBy" | "administrators" | "announcementSet"> & { 
            createdBy: IUserDoc, 
            administrators: IUserDoc[], 
            announcementSet: IAnnouncementSetDoc & { announcements: IAnnouncementDoc[] },
            assignmentSet: IAssignmentSet & { assignments: IAssignmentDoc[] }} | null>(null)
    const { isLoading, toggleLoading, resetLoading} = useLoading();

    const route =  `?isId=${( isId ?? true )}`

    useEffect(() => {
        abstractAuthenticatedRequest(
            "get",
            `/api/v1/classes/${specifier}${route}`,
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