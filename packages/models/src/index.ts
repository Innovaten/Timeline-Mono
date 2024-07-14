import mongoose from "mongoose";
import { UserModel, UserSchema } from "./user";
import { RegistrationModel, RegistrationSchema } from "./registration";
import { ClassModel, ClassSchema } from "./class";

import { IUserDoc } from "./user/index.types";
import { IRegistrationDoc } from "./registration/index.types";
import { IClassDoc } from "./class/index.types";

( async function index(){
    await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE
    });
    console.log('--- MongoDB Connected ---');
    // console.log('URI: ', process.env.MONGODB_URI, "  DB: ", process.env.MONGODB_DATABASE)
})()

export {

    //Interfaces
    type IUserDoc,
    type IRegistrationDoc,
    type IClassDoc,

    //Models
    UserModel,
    RegistrationModel,
    ClassModel,

    // Schema
    UserSchema,
    RegistrationSchema,
    ClassSchema,
}