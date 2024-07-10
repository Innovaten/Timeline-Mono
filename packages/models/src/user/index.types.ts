import { Types, Document } from "mongoose";

export interface IUser {
  code: string;
  role: "SUDO" | "ADMIN" | "STUDENT";

  firstName: string;
  lastName: string;
  otherNames: string;
  
  gender: "Male" | "Female";

  email: string;
  phone: string;
  
  classes: Types.ObjectId[]
  modeOfClass: "In-Person" | "Online"

  meta: {
    isPasswordSet: boolean;
    isSuspended: boolean;
    isDeleted: boolean;
    lastLoggedIn: Date;
  };

  auth: {
    password: string;
    otp: string;
    otp_expiry: string;
    otpLastSentAt: Date;
  };

  locker: {
    numTries: number;
    expiry: Date;
  };
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDoc extends Document, IUser {}
