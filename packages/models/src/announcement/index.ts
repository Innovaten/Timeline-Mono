import { Schema, SchemaTypes, model } from "mongoose";
import { IAnnouncement } from "./index.types";


export const AnnouncementSchema = new Schema<IAnnouncement>({
    code: {
        type: SchemaTypes.String,
        unique: true,
        index: true,
        required: true,
    },
    title:  {
        type: SchemaTypes.String,
        required: true,
    },

    content: {
        type: SchemaTypes.String,
        required: true,
    },
    announcementSet: {
        type: SchemaTypes.ObjectId,
        ref: "AnnouncementSets"
    },

    class: {
        type: SchemaTypes.ObjectId,
        ref: "Classes"
    },

    isDraft: {
        type: SchemaTypes.Boolean,
        required: true,
        default: true,
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
        required: true,
        ref: "Users"
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
        required: true,
        ref: "Users",
    },
})


export const AnnouncementModel = model("Announcements", AnnouncementSchema);


