import { Types, Document } from "mongoose";

export interface IUser {
  code: string;
  role: Types.ObjectId;

  firstName: string;
  lastName: string;
  otherNames: string;
  
  gender: "Male" | "Female";

  email: string;
  phone: string;
  
  courses: Types.ObjectId[]
  modeOfClass: "In-Person" | "Online"

  meta: {
    isVerified: boolean;
    isPasswordSet: boolean;
    hasVerifiedEmail: boolean;
    isSuspended: boolean;
    isDeleted: boolean;
    lastLoggedIn: Date;
  };

  auth: {
    password: string;
    otp: string;
    otp_expiry: string;
  };

  locker: {
    numTries: number;
    expiry: Date;
  };
  createdAt: Date,
  updatedAt: Date,
}

export interface IUserDoc extends Document, IUser {}
