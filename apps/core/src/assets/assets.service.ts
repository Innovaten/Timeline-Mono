import { Injectable, OnModuleInit } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ResourcesModel } from "@repo/models";
import { Types } from "mongoose";
import { CoreConfig } from "../config";

@Injectable()
export class AssetsService implements OnModuleInit {
  private s3: S3Client;

  onModuleInit() {
    this.s3 = new S3Client({
      region: CoreConfig.s3.region,
      credentials: {
        accessKeyId: CoreConfig.s3.access_key,
        secretAccessKey: CoreConfig.s3.secret_access_key,
      },
    });
  }

  async uploadFile(
    uploader: string,
    title: string,
    extension: string,
    file: Express.Multer.File
  ) {
    try {
      let resourceType: "Image" | "Document" | "Other";

      if (["pdf", "xls", "xlsx", "ppt", "pptx"].includes(extension)) {
        resourceType = "Document";
      } else if (["png", "jpg", "jpeg", "webp"].includes(extension)) {
        resourceType = "Image";
      } else {
        resourceType = "Other";
      }

      const resource = new ResourcesModel({
        title,
        type: resourceType,
        createdBy: new Types.ObjectId(uploader),
        updatedBy: new Types.ObjectId(uploader),
        createdAt: new Date(),
      });

      await this.s3.send(
        new PutObjectCommand({
          Bucket: CoreConfig.s3.bucket,
          Key: `${resource._id}`,
          ContentType: file.mimetype,
          ACL: "public-read",
          Body: file.buffer,
        })
      );

      resource.link = `https://${CoreConfig.s3.bucket}.s3.${CoreConfig.s3.region}.amazonaws.com/${resource._id}`;
      resource.updatedAt = new Date();

      await resource.save();
      console.log(`Uploaded ${decodeURIComponent(title)} to ${resource.link}`);

      return resource;
    } catch (err: any) {
      console.log(err);
      return `ERROR: Could not upload ${decodeURIComponent(title)}. Details: ${err.message ? err.message : err}`;
    }
  }

  async getAssetsCount() {
    try {
      const count = await ResourcesModel.countDocuments();
      return { count};
    } catch (err: any) {
      console.log(err);
      throw new Error(
        `ERROR: Could not get assets count. Details: ${err.message ? err.message : err}`
      );
    }
  }

  async getAssetsCountById(userId: string): Promise<{ count: number }> {
    try {
      const count = await ResourcesModel.countDocuments({
        createdBy: userId,
      });
      return { count };
    } catch (err: any) {
      console.log(err);
      throw new Error(
        `ERROR: Could not get assets count. Details: ${err.message ? err.message : err}`
      );
    }
  }
}
