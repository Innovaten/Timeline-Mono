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
    lessons: {
        type: [{ type: SchemaTypes.ObjectId, ref: "Lessons" }],
        default: []
    },

    createdAt: {
        type: SchemaTypes.Date,
    },
    updatedAt: {
        type: SchemaTypes.Date,
    }

})

export const  LessonSetModel = model("LessonSets", LessonSetSchema)