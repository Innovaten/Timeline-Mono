import { useState } from "react";

export function useDialog(isOpen: boolean = false){


    const [ dialogIsOpen, setDialogIsOpen ] = useState(isOpen);

    function toggleDialog(){
        setDialogIsOpen( prev => !prev);
    }

    return { dialogIsOpen, toggleDialog }

}