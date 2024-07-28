import { SchemaTypes, Schema, model } from "mongoose";
import { IModule } from "./index.types";

export const ModuleSchema = new Schema<IModule>({
    code: {
        type: SchemaTypes.String,
        unique: true,
        index: true,
        required: true,
    },
    title: {
        type: SchemaTypes.String,
        required: true,
    },
    lessonSet: {
        type: SchemaTypes.ObjectId, 
        ref: "LessonSets",
    },

    meta: {
        type: new Schema({
            isDeleted: {
                type: SchemaTypes.Boolean,
                default: false
            }
        })
    },

    classId: {
        type: SchemaTypes.ObjectId,
        ref: 'Classes',
        required: true,
    },

    createdAt: {
        type: SchemaTypes.Date,
        default: new Date()
    },
    createdBy: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'Users',
    },

    updatedAt: {
        type: SchemaTypes.Date,
        default: new Date()
    },
    updatedBy: {
        type: SchemaTypes.ObjectId,
        default: new Date(),
        ref: 'Users',
    },
})

export const ModuleModel = model("Modules", ModuleSchema)