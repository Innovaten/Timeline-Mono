import { Schema, SchemaTypes, model } from "mongoose";
import { ILessonSet } from "./index.types";

export const LessonSetSchema = new Schema<ILessonSet>({
    class: {
        type: SchemaTypes.ObjectId,
        ref: 'Classes',
        required: true,
    },

    module: {
        type: SchemaTypes.ObjectId,
        ref: 'Modules'
    },

    meta: {
        type: new Schema({
            isDeleted: {
                type: SchemaTypes.Boolean,
                default: false
            }
        })
    },

    lessons: {
        type: [SchemaTypes.ObjectId],
        ref: 'Lessons',
        default: []
    },

    title: {
        type: SchemaTypes.String,
        required: true,
    },

})

export const  LessonSetModel = model("LessonSets", LessonSetSchema)