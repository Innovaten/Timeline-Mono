import { Document, Types } from "mongoose";

export const resourceTypes = [
    "Image",
    "Document",
    "Link",
    "Other"
] as const;

export type resourceType = typeof resourceTypes[number];

export interface IResource {
  title: string;
  type: resourceType;
  
  meta: {
    isDeleted: boolean;
  };

  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export interface IResourceDoc extends Document, IResource {}
