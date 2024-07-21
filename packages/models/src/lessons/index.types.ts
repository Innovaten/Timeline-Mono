import { Document, Types } from "mongoose";

export interface ILesson {
    title: string
    content: string
    resources: Types.ObjectId[]
    lessonSet: Types.ObjectId

    isDone: boolean

    meta: {
        isDeleted: boolean
    },
    code: string

    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId

    createdAt: Date
    updatedAt: Date 
}

export interface IlessonDoc extends Document, ILesson{}