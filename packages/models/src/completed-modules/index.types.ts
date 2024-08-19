import { Document, Types } from "mongoose";

export interface ICompletedModule {
    user: Types.ObjectId
    modules: Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
    lessonSet: Types.ObjectId[]
}

export interface ICompletedModuleDoc extends Document, ICompletedModule {}