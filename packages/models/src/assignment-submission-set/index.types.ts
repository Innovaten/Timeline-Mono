import { Document, Types } from "mongoose";

export interface IAssignmentSubmissionSet {
  class: Types.ObjectId;
  classCode: string;
  
  assignment: Types.ObjectId;
  assignmentCode: string;

  submissions: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

export interface IAssignmentSubmissionSetDoc extends Document, IAssignmentSubmissionSet {}
