import { Schema, SchemaTypes, model } from "mongoose";
import { ILesson } from "./index.types";

export const LessonSchema = new Schema<ILesson>({
    title: {
        type: SchemaTypes.String,
        required: true,
    },
    content: {
        type: SchemaTypes.String,
        required: true,
    },
    resources: {
        type: [{ type: SchemaTypes.ObjectId, ref: "Resources" }],
        default: [],
    },
    lessonSet: {
        type: SchemaTypes.ObjectId,
        ref: 'LessonSets',
        required: true,
    },
    meta: {
        type: new Schema({
            isDeleted: {
                type: SchemaTypes.Boolean,
                default: false
            }
        })
    },
    code: {
        type: SchemaTypes.String,
        unique: true,
        index: true,
        required: true,
    },
    createdBy: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "Users",
    },
    createdAt: {
        type: SchemaTypes.Date,
        default: new Date(),
    },
    updatedAt: {
        type: SchemaTypes.Date,
        default: new Date(),
    },
    updatedBy: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "Users",
    },
})

export const LessonModel = model("Lessons", LessonSchema)