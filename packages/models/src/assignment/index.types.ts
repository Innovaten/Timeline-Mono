import { Types, Document } from "mongoose";


export interface IAssignment {
    code: string;
    title: string;
    instructions: string;
    maxScore: number;
    assignmentSet: Types.ObjectId;
  
    class: Types.ObjectId;
    classCode: string,
    resources: Types.ObjectId[],
    accessList: Types.ObjectId[],

    startDate: Date,
    endDate: Date,
    
    meta: {
      isDeleted: boolean;
      isDraft: boolean;
    };
  
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
  
    createdAt: Date;
    updatedAt: Date;

} 

export interface IAssignmentDoc extends Document, IAssignment {}