import { Document, Types } from "mongoose";

export const ClassStatus = ["Active", "Suspended"] as const;
export type ClassStatusType = typeof ClassStatus[number];

export const modeOfClass = ["Online", "In-Person"] as const;
export type modeOfClassType = typeof ClassStatus[number];

export interface IClass {
  code: string;
  name: string;
  modeOfClass: modeOfClassType;
  status: ClassStatusType;
  
  administrators: Types.ObjectId[];
  lessons: Types.ObjectId[];
  resources: Types.ObjectId[];
  assignments: Types.ObjectId[];
  quizzes: Types.ObjectId[];
  
  // settings: {};

  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export interface IClassDoc extends Document, IClass {}
