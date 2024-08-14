import { Types, Document } from "mongoose";

export const AssignmentSubmissionStatuses = ["Pending","Submitted", "Graded"] as const;
type AssignmentSubmissionStatusType = typeof AssignmentSubmissionStatuses[number] 

export interface IAssignmentSubmission {
    code: string;

    class: Types.ObjectId;
    classCode: string,
    assignment: Types.ObjectId;

    resources: Types.ObjectId[];
    
    status: AssignmentSubmissionStatusType,

    meta: {
        isDeleted: boolean;
        isDraft: boolean;
    };

    feedback: string;
    score: number;
    
    createdBy: Types.ObjectId;
    submittedBy: Types.ObjectId;
    gradedBy: Types.ObjectId;

    submittedAt: Date;
    gradedAt: Date;
  
    createdAt: Date;
    updatedAt: Date;
} 

export interface IAssignmentSubmissionDoc extends Document, IAssignmentSubmission {}