import { useEffect, useState } from "react";


export function useMobileNavigation(pathName: string){
    const [ navIsOpen, setNavIsOpen ] = useState(false);

    useEffect(
        function redirectAfterPathChange(){
        resetNav();
    }, [pathName])

    function toggleNav(){
        setNavIsOpen(prev => !prev);
    }

    function resetNav(){
        setNavIsOpen(false);
    }

    return { navIsOpen, toggleNav, resetNav }
}