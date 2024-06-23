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
        type: [ SchemaTypes.ObjectId],
        default: []
    },
    lessons: {
        type: [ SchemaTypes.ObjectId],
        default: []
    },
    resources:  {
        type: [ SchemaTypes.ObjectId],
        default: []
    },
    assignments: {
        type: [ SchemaTypes.ObjectId],
        default: []
    },
    quizzes: {
        type: [ SchemaTypes.ObjectId],
        default: []
    },
    timetable: {
        type: SchemaTypes.ObjectId,
        default: null,
    },
    /*
    settings: {
        type: SchemaTypes.Subdocument,
        default: {}
    },
    */

    createdBy: {
        type: SchemaTypes.ObjectId,
        required: true,
    },

    createdAt: {
        type: SchemaTypes.Date,
        default: new Date()
    },
    updatedAt: {
        type: SchemaTypes.Date,
        default: new Date()
    },
})


export const ClassModel = model("Classes", ClassSchema);


