import { Document, Types } from "mongoose";

export interface IAnnouncement {
  code: string;
  title: string;
  content: string;
  announcementSet: Types.ObjectId;

  meta: {
    isDeleted: boolean;
  };

  isDraft: Boolean;

  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export interface IAnnouncementDoc extends Document, IAnnouncement {}
