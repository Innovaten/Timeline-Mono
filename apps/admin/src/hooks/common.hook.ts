import { useState } from "react";

export function useSpecificEntity<K>(){
    const [ entity, setEntity ] = useState<K|null>(null);
    

    function resetSelected(){
        setEntity(null);
    }

    function setSelected(item: K){
        setEntity(item);        
    }

    return { entity, resetSelected, setSelected };
}