import { Document, Types } from "mongoose";

export interface ICompletedLesson {
    user: Types.ObjectId
    lessons: Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
    lessonSet: Types.ObjectId[]
}

export interface ICompletedLessonDoc extends Document, ICompletedLesson {}