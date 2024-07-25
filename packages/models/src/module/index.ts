import { SchemaTypes, Schema, model } from "mongoose";
import { IModules } from "./index.types";

export const ModuleSchema = new Schema<IModules>({
    title: {
        type: SchemaTypes.String,
        required: true,
    },
    lessonSet: {
        type: [SchemaTypes.ObjectId],
        default: [],
    },
    moduleId: {
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

    classId: {
        type: SchemaTypes.ObjectId,
        ref: 'Classes',
        required: true,
    },
    code: {
        type: SchemaTypes.String,
        unique: true,
        index: true,
        required: true,
    },
    createdBy: {
        type: SchemaTypes.ObjectId,
        required: true,
    },

    createdAt: {
        type: SchemaTypes.Date,
        default: new Date()
    },
    updatedAt: {
        type: SchemaTypes.Date,
        default: new Date()
    },
    updatedBy: {
        type: SchemaTypes.ObjectId,
        default: new Date()
    },
})

export const ModuleModel = model("Modules", ModuleSchema)