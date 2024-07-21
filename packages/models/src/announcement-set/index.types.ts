import { Document, Types } from "mongoose";

export interface IAnnouncementSet {
  code: string;
  class: Types.ObjectId;

  announcements: Types.ObjectId[]

  updatedBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export interface IAnnouncementSetDoc extends Document, IAnnouncementSet {}
