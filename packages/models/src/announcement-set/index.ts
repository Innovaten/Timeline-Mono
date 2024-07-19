import { Schema, SchemaTypes, model } from "mongoose";
import { IAnnouncementSet } from "./index.types";


export const AnnouncementSetSchema = new Schema<IAnnouncementSet>({
    code: {
        type: SchemaTypes.String,
        unique: true,
        index: true,
        required: true,
    },
    class: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    totalAnnouncements: {
        type: SchemaTypes.Number,
        default: 0,
    },
  
    announcements: {
        type: [SchemaTypes.ObjectId]
    },
    updatedBy: {
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
})


export const AnnouncementSetModel = model("AnnouncementSets", AnnouncementSetSchema);


