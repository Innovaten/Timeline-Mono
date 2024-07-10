import { Document, Types } from "mongoose";

export const RegistrationStatus = ["Pending", "Approved", "Rejected","Accepted", "Denied"] as const;
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
  classes: Array<string>;

  approvedClasses: Array<Types.ObjectId>;
  approvedBy: Types.ObjectId;
  approvedAt: Date;
  rejectedBy: Types.ObjectId;
  rejectedAt: Date;
  acceptedBy: Types.ObjectId;
  acceptedAt: Date;
  deniedAt: Date;

  status: RegistrationStatusType;

  createdAt: Date;
  updatedAt: Date;
}

export interface IRegistrationDoc extends Document, IRegistration {}
