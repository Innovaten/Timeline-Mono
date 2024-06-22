import { Schema, SchemaTypes, model } from "mongoose";
import { IClassDoc } from "./class.types";

export const ClassSchema = new Schema<IClassDoc> ({
    code: {
        type: SchemaTypes.String,
        unique: true,
        index: true,
        required: true,
    },
    name: {
        type: SchemaTypes.String,
        required: true,
    },
    date: {
        type: SchemaTypes.Date,
        required: true,
    },
    time: {
        type: SchemaTypes.String,
        required: true,
    },
    mode: {
        type: SchemaTypes.String,
        enum: ["Online", "In-Person"],
        required: true,
    },
    administrator: {
        type: SchemaTypes.ObjectId,
        ref: "Admin",
    },
    createdAt: {
        type: SchemaTypes.Date,
        default: new Date(),
    },
    updatedAt: {
        type: SchemaTypes.Date,
        default: new Date,
    },
})

export const ClassModel = model("Class", ClassSchema)