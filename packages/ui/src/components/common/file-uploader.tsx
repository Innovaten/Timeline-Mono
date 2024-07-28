import { Dispatch, SetStateAction, useState } from "react"
import { IResourceDoc } from "@repo/models";
import { DashboardModal, useUppyEvent } from '@uppy/react';
import Uppy from '@uppy/core';
import { _getToken, useDialog } from '@repo/utils';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import XHR from '@uppy/xhr-upload';
import { Button } from "../forms";
import Compressor from "@uppy/compressor";

type FileUploaderProps = {
    filesHook: {
        files: IResourceDoc[],
        addToFiles: (file: IResourceDoc) => void,
    };
    buttonVariant?: "primary" | "outline" | "secondary" | "neutral";
    allowMultipleFiles?: boolean;
}

export function FileUploader({ filesHook, buttonVariant }: FileUploaderProps) {
   
    const { dialogIsOpen: modalIsOpen, toggleDialog: toggleUploadModal } = useDialog();

    const [ uppy ] = useState(
        () => new Uppy({
                allowMultipleUploadBatches: false,
                restrictions: {
                    minNumberOfFiles: 0,
                    maxNumberOfFiles: 15,
                }
            })
            .use(Compressor, { quality: 0.6 })
            .use(XHR, { 
                // @ts-ignore
                endpoint: `${import.meta.env.VITE_CORE_URL ?? "http://localhost:4000" }/api/v1/assets/upload`,
                headers: (file) => {
                    const headerData: Record<string, any> =  {
                        authorization: `Bearer ` + _getToken(),
                        "original-file-name": file.name,
                        "original-file-ext": file.extension
                    }
                    return headerData;
                },
            })
        );

    useUppyEvent(uppy, 'upload-success', (file, response) => {
        if(response?.body?.success){
            console.log(response)
            filesHook.addToFiles(response!.body!.data)
        }
    })
    
    return (
        <>
            <DashboardModal 
                uppy={uppy}
                open={modalIsOpen}
            />;
            <Button
                { ...(buttonVariant ? { variant: buttonVariant } : {} )}
                onClick={toggleUploadModal}
            >Upload Files</Button>
        </>
    )
}