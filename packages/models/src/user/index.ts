import { Schema, SchemaTypes, model } from "mongoose";
import { IUserDoc } from "./index.types";
import bcrypt from "bcrypt";

export const UserSchema = new Schema<IUserDoc>({
  code: {
    type: SchemaTypes.String,
    unique: true,
    index: true,
    required: true,
  },
  role: {
    type: SchemaTypes.String,
    enum: ["SUDO", "ADMIN", "STUDENT"],
    required: true,
  },
  firstName: {
    type: SchemaTypes.String,
    trim: true,
    required: true,
  },
  lastName: {
    type: SchemaTypes.String,
    trim: true,
    required: true,
  },
  otherNames: {
    type: SchemaTypes.String,
    trim: true,
  },
  gender: {
    type: SchemaTypes.String,
    enum: ["Male", "Female"],
    required: true,
  },

  email: {
    type: SchemaTypes.String,
    trim: true,
    required: true,
  },
  phone: {
    type: SchemaTypes.String,
    trim: true,
    required: true,
  },

  classes: {
    type: [{ type: SchemaTypes.ObjectId, ref: "Classes" }],
    required: false,
  },

  modeOfClass: {
    type: SchemaTypes.String,
    enum: ["In-Person", "Online"],
    required: false,
  },

  completedLessons: {
    type: SchemaTypes.ObjectId,
    ref: "CompletedLessons",
  },

  meta: {
    isPasswordSet: {
      type: SchemaTypes.Boolean,
      default: false,
    },
    isSuspended: {
      type: SchemaTypes.Boolean,
      default: false,
    },
    isDeleted: {
      type: SchemaTypes.Boolean,
      default: false,
    },
    lastLoggedIn: {
      type: SchemaTypes.Date,
    },
  },

  auth: {
    password: {
      type: SchemaTypes.String,
      trim: true,
      required: true,
    },
    otpLastSentAt: {
      type: SchemaTypes.Date,
      required: false,
    },
    otp: {
      type: SchemaTypes.String,
      required: false,
    },
    otp_expiry: {
      type: SchemaTypes.Date,
      required: false,
    },
    
  },

  locker: {
    numTries: {
      type: SchemaTypes.Number,
      min: 0,
      default: 0,
    },
    expiry: {
      type: SchemaTypes.Date,
    },
  },

  createdBy: {
    type: SchemaTypes.ObjectId,
    ref: "Users"
  },

  createdAt: {
    type: SchemaTypes.Date,
    default: new Date()
  },
  updatedAt: {
    type: SchemaTypes.Date,
    default: new Date()
  }


});

UserSchema.virtual("fullName").get(function (this: IUserDoc) {
  return [this.firstName, this.otherNames, this.lastName].join(" ");
});

UserSchema.pre("save", async function (this: IUserDoc, next) {
  if (this.isModified("auth.password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.auth.password, salt);
      this.auth.password = hash;
    } catch (err: any) {
      next(err);
    }
  }
  next();
});

export const UserModel = model("Users", UserSchema);
