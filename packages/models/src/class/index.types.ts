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
  students: Types.ObjectId[];
  modules: Types.ObjectId[];
  resources: Types.ObjectId[];
  quizzes: Types.ObjectId[];
  timetable: Types.ObjectId;
  announcementSet: Types.ObjectId;
  assignmentSet: Types.ObjectId;
  
  // settings: {};

  meta: {
    isDeleted: boolean;
  };

  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export interface IClassDoc extends Document, IClass {}
