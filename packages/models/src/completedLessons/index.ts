import { SchemaTypes, Schema, model } from "mongoose";
import { ICompletedLesson } from "./index.types";

export const CompletedLessonSchema = new Schema<ICompletedLesson> ({
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'Users',
        required: true,
    },
    lessons: {
        type: [{ type: SchemaTypes.ObjectId, ref: 'Lessons' }],
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