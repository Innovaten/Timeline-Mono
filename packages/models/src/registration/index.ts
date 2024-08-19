import { Schema, SchemaTypes, model } from "mongoose";
import { IRegistrationDoc, RegistrationStatus } from "./index.types";


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
    },
    phone:  {
        type: SchemaTypes.String,
        required: true,
    },
    classes:  {
        type: [SchemaTypes.String],
        required: true,
    },

    status: {
        type: SchemaTypes.String,
        enum: RegistrationStatus,
        default: "Pending",
    },

    approvedClasses: {
        type: [SchemaTypes.ObjectId],
        default: [],
        ref: "Classes"
    },

    approvedBy: {
        type: SchemaTypes.ObjectId,
        ref: "Users",
    },
    approvedAt: {
        type: SchemaTypes.Date,
    },
    
    rejectedBy: {
        type: SchemaTypes.ObjectId,
        ref: "Users",
    },
    rejectedAt: {
        type: SchemaTypes.Date,
    }, 
    
    acceptedBy: {
        type: SchemaTypes.ObjectId,
        ref: "Users",
    },
    acceptedAt: {
        type: SchemaTypes.Date,
    },

    deniedAt: {
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


