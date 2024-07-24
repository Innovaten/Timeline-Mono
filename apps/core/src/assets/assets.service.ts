import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ResourcesModel } from '@repo/models';
import { Types } from 'mongoose';
import { CoreConfig } from '../config';

@Injectable()
export class AssetsService {

    constructor(
        private s3: S3Client,
    ) {

        this.s3 = new S3Client();
     }


    async uploadFiles(uploader: string, title: string, extension: string, file: Express.Multer.File){
     
        try {
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
                    break;
    
                default:
                    resourceType = "Other";
                    break;
            }
    
            const resource = new ResourcesModel({
                title,
                resourceType,
                createdBy: new Types.ObjectId(uploader),
                updatedBy: new Types.ObjectId(uploader),
                createdAt: new Date(),
            })
    
            await this.s3.send(
                new PutObjectCommand({
                    Bucket: CoreConfig.s3.bucket,
                    Key: `${resource._id}`,
                    Body: file.buffer,
                    ACL: 'public-read'
                })
            )
    
            resource.link = `https://${CoreConfig.s3.bucket}.s3.${CoreConfig.s3.region}.amazonaws.com/${resource._id}`;
            resource.updatedAt = new Date()
    
            await resource.save();
            console.log(`Uploaded ${title} to ${resource.link}`)
            return resource.link;

        } catch (err: any) {
            console.log(err);
            return `ERROR: Could not upload ${title}. Details: ${err.message ? err.message : err}`
        }

    }
}
