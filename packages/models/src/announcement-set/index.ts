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
  
    announcements: {
        type: [SchemaTypes.ObjectId]
    },
    updatedBy: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "Users"
    },
}, { timestamps: true })


export const AnnouncementSetModel = model("AnnouncementSets", AnnouncementSetSchema);


