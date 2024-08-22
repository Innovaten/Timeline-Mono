import { useState } from "react";
import { IResourceDoc } from '@repo/models'

export function useFileUploader(){

    const [ files, setFiles ] = useState<IResourceDoc[]>([])

    function addToFiles(file: any){
        if(files.map(r => `${r._id}`).includes(`${file._id}`)) return
        setFiles(prev => [...prev, file])
    }

    function removeSpecificFile(id: string){
        setFiles(prev => {
            return prev.filter(f => f.id != id);
        })
    }

    return { files, addToFiles, removeSpecificFile }

}