import { Types, Document } from "mongoose";

interface IUser {
  code: string;
  role: Types.ObjectId;

  firstName: string;
  lastName: string;
  otherNames: string;
  gender: "Male" | "Female";

  email: string;
  phone: string;

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
  };

  locker: {
    numTries: number;
    expiry: Date;
  };
}

export interface IUserDoc extends Document, IUser {}
