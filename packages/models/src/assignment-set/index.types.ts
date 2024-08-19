import { Document, Types } from "mongoose";

export interface IAssignmentSet {
  code: string;
  class: Types.ObjectId;
  classCode: string;
  assignments: Types.ObjectId[]

  updatedBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export interface IAssignmentSetDoc extends Document, IAssignmentSet {}
