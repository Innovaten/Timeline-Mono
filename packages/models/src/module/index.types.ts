import { Document, Types } from "mongoose";

export interface IModule {
    code: string
    title: string
    lessonSet: Types.ObjectId
    resources: Types.ObjectId[]

    meta: {
        isDeleted: boolean
    }

    classId: Types.ObjectId
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId

    createdAt: Date
    updatedAt: Date 
}

export interface IModuleDoc extends Document, IModule{}