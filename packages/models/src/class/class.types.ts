import { Document, Types } from "mongoose"

export interface IClass {
    code: string
    name: string
    date: Date
    time: string
    mode: string
    administrator: Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

export interface IClassDoc extends Document, IClass {}

