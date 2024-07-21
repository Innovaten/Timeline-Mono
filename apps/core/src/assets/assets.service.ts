import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ResourcesModel } from '@repo/models';
import { Types } from 'mongoose';
import { CoreConfig } from '../config';

@Injectable()
export class AssetsService {

    constructor(
        private s3Client: S3Client,
    ) { }


    async uploadFiles(uploader: string, title: string, extension: string){
     
        let resourceType: "Image" | "Document" | "Other";

        switch (extension) {
            case "pdf":
            case "xls":
            case "xlsx":
            case "ppt":
            case "pptx":
                resourceType = "Document"; 
                break;
            
            case "png":
            case "jpg":
            case "jpeg":
            case "webp":
                resourceType = "Image";
            default:
                resourceType = "Other";
                break;
        }
        
        const resource = new ResourcesModel({
            title,
            resourceType,
            createdBy: new Types.ObjectId(uploader),
            updatedBy: new Types.ObjectId(uploader),
        })

        const file = new PutObjectCommand({
            Bucket: CoreConfig.aws.s3.bucket,
            Key: `${resource._id}`,
            Body:  // hmmmm
        })

        // await upload,
        // return signedUrl

        

    }
}
