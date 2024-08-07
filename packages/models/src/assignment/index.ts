import { Schema, SchemaTypes, model } from "mongoose";
import { IAssignment } from "./index.types";

export const AssignmentSchema = new Schema<IAssignment>({
    code: {
        type: SchemaTypes.String,
        unique: true,
        index: true,
        required: true,
    },
    assignmentSet: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "AssignmentSets"
    },
    class: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "Classes",
    },
    classCode: {
        type: SchemaTypes.String,
        required: true,
    },
    title:  {
        type: SchemaTypes.String,
        required: true,
    },
    instructions: {
        type: SchemaTypes.String,
        required: true,
    },
    maxScore: {
        type: SchemaTypes.Number,
        required: true,
    },
    resources: {
        type: [{ type: SchemaTypes.ObjectId, ref: "Resources" }],
        default: [],
        required: true,
    },

    accessList: {
        type: [{ type: SchemaTypes.ObjectId, ref: "Users" }],
        default: [],
        required: true,
    },

    assignmentSubmissionSet: {
        type: SchemaTypes.ObjectId,
        ref: "AssignmentSubmissionSets",
        required: false,
    },

    startDate: {
        type: SchemaTypes.Date,
        default: new Date(),
    },
    endDate: {
        type: SchemaTypes.Date,
        default: new Date(),
    },

    meta: {
        type: new Schema({
            isDeleted: {
                type: SchemaTypes.Boolean,
                default: false
            },
            isDraft: {
                type: SchemaTypes.Boolean,
                required: true,
                default: true,
            },
        })
    },

    createdBy: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "Users"
    },
    updatedBy: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "Users",
    },

}, { timestamps: true })


export const AssignmentModel = model("Assignments", AssignmentSchema);


