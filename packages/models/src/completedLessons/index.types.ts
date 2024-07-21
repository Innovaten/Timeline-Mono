import { Document, Types } from "mongoose";

export interface ICompletedLessons {
    user: Types.ObjectId
    lessons: Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
}

export interface ICompletedLessonsDoc extends Document, ICompletedLessons {}