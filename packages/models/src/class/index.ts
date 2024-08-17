import { Schema, SchemaTypes, model } from "mongoose";
import { ClassStatus, IClassDoc, modeOfClass } from "./index.types";


export const ClassSchema = new Schema<IClassDoc>({
    code: {
        type: SchemaTypes.String,
        unique: true,
        index: true,
        required: true,
    },
    name:  {
        type: SchemaTypes.String,
        required: true,
    },

    modeOfClass:  {
        type: SchemaTypes.String,
        enum: modeOfClass,
        required: true,
    },

    status: {
        type: SchemaTypes.String,
        enum: ClassStatus,
        default: "Active",
    },

    administrators: {
        type: [ { type: SchemaTypes.ObjectId, ref: "Users" }],
        default: []
    },
    students: {
        type: [ { type: SchemaTypes.ObjectId, ref: "Users" }],
        default: []
    },
    modules: {
        type: [ SchemaTypes.ObjectId],
        default: [],
        ref: "Modules",
    },
    resources:  {
        type: [ SchemaTypes.ObjectId],
        default: []
    },
    assignmentSet: {
        type: SchemaTypes.ObjectId,
        ref: "AssignmentSets"
    },
    timetable: {
        type: SchemaTypes.ObjectId,
        default: null,
    },
    announcementSet: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "AnnouncementSets"
    },
    /*
    settings: {
        type: SchemaTypes.Subdocument,
        default: {}
    },
    */

    meta: {
        type: new Schema({
            isDeleted: {
                type: SchemaTypes.Boolean,
                default: false
            }
        })
    },

    createdBy: {
        type: SchemaTypes.ObjectId,
        ref: "Users",
        required: true,
    },
    updatedBy: {
        type: SchemaTypes.ObjectId,
        default: new Date(),
        ref: "Users"
    },
}, { timestamps: true})


export const ClassModel = model("Classes", ClassSchema);


