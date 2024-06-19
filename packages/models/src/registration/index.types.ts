import { Document } from "mongoose";

export interface IRegistration {
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  modeOfClass: string;
  otherNames: string;
  phone: string;
  courses: Array<string>;

  createdAt: Date,
  updatedAt: Date,
}

export interface IRegistrationDoc extends Document, IRegistration {}
