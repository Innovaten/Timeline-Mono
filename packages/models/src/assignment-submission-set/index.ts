import { Schema, SchemaTypes, model } from "mongoose";
import { IAssignmentSubmissionSet } from "./index.types";


export const AssignmentSubmissionSetSchema = new Schema<IAssignmentSubmissionSet>({
    class: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    classCode: {
        type: SchemaTypes.String,
        required: true,
    },

    assignment: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    assignmentCode: {
        type: SchemaTypes.String,
        required: true,
    },
  
    submissions: {
        type: [{ type: SchemaTypes.ObjectId, ref: "AssignmentSubmissions" }]
    },

}, { timestamps: true })


export const AssignmentSubmissionSetModel = model("AssignmentSubmissionSets", AssignmentSubmissionSetSchema);


