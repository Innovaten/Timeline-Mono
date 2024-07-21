import { Schema, SchemaTypes, model } from "mongoose";
import { ILessonSet } from "./index.types";

export const LessonSetSchema = new Schema<ILessonSet>({
    class: {
        type: SchemaTypes.ObjectId,
        ref: 'Classes',
        required: true,
    },
    totalLessons: {
        type: SchemaTypes.Number,
        default: 0,
    },
    lessons: {
        type: [SchemaTypes.ObjectId],
        ref: 'Lessons',
        default: []
    },
    code: {
        type: SchemaTypes.String,
        unique: true,
        index: true,
        required: true,
    },
    updatedBy: {
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
})

export const  LessonSetModel = model("LessonSets", LessonSetSchema)