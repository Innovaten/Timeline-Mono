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
    isDone: {
        type: SchemaTypes.Boolean,
        required: true,
        default: false,
    },
    resources: {
        type: [SchemaTypes.ObjectId],
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
    },
})

export const LessonModel = model("Lessons", LessonSchema)