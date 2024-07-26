import { Document, Types } from "mongoose";

export interface IModule {
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

export interface IModulesDoc extends Document, IModule{}