import { Document, Types } from "mongoose";

export const RegistrationStatus = ["Pending", "Approved", "Rejected"] as const;
export const AdmissionStatus = ["Pending", "Accepted", "Rejected"] as const;
export type RegistrationStatusType = typeof RegistrationStatus[number];
export type AdmissionStatusType = typeof AdmissionStatus[number];

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

  status: RegistrationStatusType;
  admissionStatus: AdmissionStatusType;

  createdAt: Date;
  updatedAt: Date;
}

export interface IRegistrationDoc extends Document, IRegistration {}
