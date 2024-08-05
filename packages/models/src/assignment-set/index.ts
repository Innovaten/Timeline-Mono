import { Schema, SchemaTypes, model } from "mongoose";
import { IAssignmentSet } from "./index.types";


export const AssignmentSetSchema = new Schema<IAssignmentSet>({
    code: {
        type: SchemaTypes.String,
        unique: true,
        index: true,
        required: true,
    },
    class: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    classCode: {
        type: SchemaTypes.String,
        required: true,
    },
  
    assignments: {
        type: [{ type: SchemaTypes.ObjectId, ref: "Assignments" }]
    },

    updatedBy: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "Users"
    },

}, { timestamps: true })


export const AssignmentSetModel = model("AssignmentSets", AssignmentSetSchema);


