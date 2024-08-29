import { SchemaTypes, Schema, model } from "mongoose";
import { ICompletedModule } from "./index.types";

export const CompletedModulesSchema = new Schema<ICompletedModule> ({
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'Users',
        required: true,
    },
    modules: {
        type: [{ type: SchemaTypes.ObjectId, ref: 'Lessons' }],
        required: true,
    },
    updatedAt: {
        type: SchemaTypes.Date,
        default: new Date()
    },
    createdAt: {
        type: SchemaTypes.Date,
        default: new Date()
    }
})

export const CompletedModulesModel = model("CompletedModules", CompletedModulesSchema)