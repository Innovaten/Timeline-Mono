import { Document, Types } from "mongoose";

export interface ILessonSet {
    class: Types.ObjectId
    totalLessons: number
    lessons: Types.ObjectId[]
    code: string

    updatedBy: Types.ObjectId

    createdAt: Date
    updatedAt: Date
}


export interface ILessonSetDoc extends Document, ILessonSet {}