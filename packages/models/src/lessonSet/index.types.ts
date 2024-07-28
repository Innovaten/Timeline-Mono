import { Document, Types } from "mongoose";

export interface ILessonSet {
    class: Types.ObjectId
    lessons: Types.ObjectId[]
    module: Types.ObjectId
    
    meta: {
        isDeleted: boolean;
    }

    createdAt: Date
    updatedAt: Date
}


export interface ILessonSetDoc extends Document, ILessonSet {}