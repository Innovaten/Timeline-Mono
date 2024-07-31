import { useState } from "react"


export function useToggleManager<T extends string>(initialState: Record<T, any>){

    const [ manager, setManager ] = useState<Record<T,any>>(initialState)

    function get(key: T){
        return manager[key]
    }

    function toggle(key: T){
        setManager(prev => {
            return {
                ...prev,
                [key]: !prev[key]
            }
        })
    }


    function reset(key: T){
        setManager(prev => {
            return {
                ...prev,
                [key]: false
            }
        })
    }

    return { get, toggle, reset }

}