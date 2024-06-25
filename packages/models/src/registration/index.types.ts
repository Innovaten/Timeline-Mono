import { Document, Types } from "mongoose";

export const RegistrationStatus = ["Pending", "Approved", "Rejected"] as const;
export type RegistrationStatusType = typeof RegistrationStatus[number];

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

  approvedBy: Types.ObjectId;
  approvedAt: Date;
  rejectedBy: Types.ObjectId;
  rejectedAt: Date;
  acceptedBy: Types.ObjectId;
  acceptedAt: Date;

  status: RegistrationStatusType;

  createdAt: Date;
  updatedAt: Date;
}

export interface IRegistrationDoc extends Document, IRegistration {}
