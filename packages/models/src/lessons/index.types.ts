import { Document, Types } from "mongoose";

export interface ILesson {
    code: string
    title: string
    content: string
    resources: Types.ObjectId[]
    lessonSet: Types.ObjectId

    meta: {
        isDeleted: boolean
    },

    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId

    createdAt: Date
    updatedAt: Date 
}

export interface ILessonDoc extends Document, ILesson{}