import mongoose from "mongoose";
import { UserModel, UserSchema } from "./user";
import { RegistrationModel, RegistrationSchema } from "./registration";
import { ClassModel, ClassSchema } from "./class";
import { ModuleModel, ModuleSchema } from "./module";
import { LessonModel, LessonSchema } from "./lessons";
import { LessonSetModel, LessonSetSchema } from "./lessonSet";
import { CompletedLessonSchema, CompletedLessonsModel } from "./completedLessons";

import { IUserDoc } from "./user/index.types";
import { IRegistrationDoc } from "./registration/index.types";
import { IClassDoc } from "./class/index.types";
import { IModuleDoc } from "./module/index.types";
import { IlessonDoc } from "./lessons/index.types";
import { ILessonSetDoc } from "./lessonSet/index.types";
import { ICompletedLessonDoc } from "./completedLessons/index.types";

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
    type IModuleDoc,
    type IlessonDoc,
    type ILessonSetDoc,
    type ICompletedLessonDoc,

    //Models
    UserModel,
    RegistrationModel,
    ClassModel,
    ModuleModel,
    LessonModel,
    LessonSetModel,
    CompletedLessonsModel,

    // Schema
    UserSchema,
    RegistrationSchema,
    ClassSchema,
    ModuleSchema,
    LessonSchema,
    LessonSetSchema,
    CompletedLessonSchema,
}