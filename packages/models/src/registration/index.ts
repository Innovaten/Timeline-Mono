import { Schema, SchemaTypes, model } from "mongoose";
import { IRegistrationDoc } from "./index.types";


export const RegistrationSchema = new Schema<IRegistrationDoc>({
    code: {
        type: SchemaTypes.String,
        unique: true,
        index: true,
        required: true,
    },
    firstName:  {
        type: SchemaTypes.String,
        required: true,
    },
    lastName:  {
        type: SchemaTypes.String,
        required: true,
    },
    email:  {
        type: SchemaTypes.String,
        required: true,
    },
    gender:  {
        type: SchemaTypes.String,
        enum: ["Male", "Female"],
        required: true,
    },
    modeOfClass:  {
        type: SchemaTypes.String,
        enum: ["Online", "In-Person"],
        required: true,
    },
    otherNames:  {
        type: SchemaTypes.String,
        required: true,
    },
    phone:  {
        type: SchemaTypes.String,
        required: true,
    },
    courses:  {
        type: [SchemaTypes.String],
        required: true,
    },
    approvedAt: {
        type: SchemaTypes.Date,
    },
    acceptedAt: {
        type: SchemaTypes.Date,
    },

    createdAt: {
        type: SchemaTypes.Date,
        default: new Date()
    },
    updatedAt: {
        type: SchemaTypes.Date,
        default: new Date()
    },
})


export const RegistrationModel = model("Registrations", RegistrationSchema);


