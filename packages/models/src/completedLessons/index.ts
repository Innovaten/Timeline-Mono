import { SchemaTypes, Schema, model } from "mongoose";
import { ICompletedLessons } from "./index.types";

export const CompletedLessonSchema = new Schema<ICompletedLessons> ({
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'Users',
        required: true,
    },
    lessons: {
        type: [SchemaTypes.ObjectId],
        ref: 'Lessons',
        required: true,
    },
    updatedAt: {
        type: SchemaTypes.Date,
        default: new Date()
    },
    createdAt: {
        type: SchemaTypes.Date,
        default: new Date()
    }
})

export const CompletedLessonsModel = model("CompletedLessons", CompletedLessonSchema)