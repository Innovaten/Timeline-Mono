import { useEffect, useState } from "react";


export default function useCompositeFilterFlag(args: boolean[]){

    const [ compositeFilterFlag, setCompositeFilterFlag ] = useState<boolean>(false);

    useEffect(() =>{
        setCompositeFilterFlag(prev => !prev)
    
    }, args)
    function manuallyToggleCompositeFilterFlag(){
        setCompositeFilterFlag(prev => !prev)
    }

    return { compositeFilterFlag, manuallyToggleCompositeFilterFlag }
}