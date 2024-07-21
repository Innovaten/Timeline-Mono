import { Schema, SchemaTypes, model } from "mongoose";
import { IResourceDoc, resourceTypes } from "./index.types";


export const ResourceSchema = new Schema<IResourceDoc>({
    title:  {
        type: SchemaTypes.String,
        required: true,
    },
    
    
    type: {
        type: SchemaTypes.String,
        enum: resourceTypes,
        required: true,
        default: "Other"
    },

    meta: {
        type: new Schema({
            isDeleted: {
                type: SchemaTypes.Boolean,
                default: false
            }
        })
    },

    createdBy: {
        type: SchemaTypes.ObjectId,
        ref: "Users",
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
        default: new Date(),
        ref: "Users"
    },
})


export const ResourcesModel = model("Resources", ResourceSchema);


