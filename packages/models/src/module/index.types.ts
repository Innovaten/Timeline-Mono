import { Document, Types } from "mongoose";

export interface IModules {
    title: string
    lessonSet: Types.ObjectId[]

    moduleId: Types.ObjectId

    meta: {
        isDeleted: boolean
    }

    classId: Types.ObjectId
    code: string
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId

    createdAt: Date
    updatedAt: Date 
}

export interface IModulesDoc extends Document, IModules{}