import { SchemaTypes, Schema, model } from "mongoose";
import { IModule } from "./index.types";

export const ModuleSchema = new Schema<IModule>({
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
        ref: 'Users',
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
        default: new Date(),
        ref: 'Users',
    },
})

export const ModuleModel = model("Modules", ModuleSchema)