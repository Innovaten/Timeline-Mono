import { useState } from "react";

export default function useDialog(isOpen: boolean = false){


    const [ dialogIsOpen, setDialogIsOpen ] = useState(isOpen);

    function toggleDialog(){
        setDialogIsOpen( prev => !prev);
    }

    return { dialogIsOpen, toggleDialog }

}