import mongoose from "mongoose";
import { UserModel, UserSchema } from "./user";
import { RegistrationModel, RegistrationSchema } from "./registration";
import { ClassModel, ClassSchema } from "./class";
import { AnnouncementModel, AnnouncementSchema } from './announcement'
import { AnnouncementSetModel, AnnouncementSetSchema } from './announcement-set'
import { ResourcesModel, ResourceSchema } from "./resource";
import { ModuleModel, ModuleSchema } from "./module";
import { LessonModel, LessonSchema } from "./lessons";
import { LessonSetModel, LessonSetSchema } from "./lessonSet";
import { CompletedLessonSchema, CompletedLessonsModel } from "./completedLessons";
import { AssignmentSetModel, AssignmentSetSchema } from "./assignment-set";
import { AssignmentModel, AssignmentSchema } from "./assignment";

import { IUserDoc } from "./user/index.types";
import { IRegistrationDoc } from "./registration/index.types";
import { IClassDoc } from "./class/index.types";
import { IAnnouncementDoc } from "./announcement/index.types";
import { IAnnouncementSetDoc } from "./announcement-set/index.types";
import { IResourceDoc } from "./resource/index.types";
import { IModuleDoc } from "./module/index.types";
import { ILessonDoc } from "./lessons/index.types";
import { ILessonSetDoc } from "./lessonSet/index.types";
import { ICompletedLessonDoc } from "./completedLessons/index.types";
import { IAssignmentSet, IAssignmentSetDoc } from "./assignment-set/index.types";
import { IAssignment, IAssignmentDoc } from "./assignment/index.types";

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
    type IAnnouncementDoc,
    type IAnnouncementSetDoc,
    type IResourceDoc,
    type IModuleDoc,
    type ILessonDoc,
    type ILessonSetDoc,
    type ICompletedLessonDoc,
    type IAssignmentSet,
    type IAssignmentSetDoc,
    type IAssignment,
    type IAssignmentDoc,

    //Models
    UserModel,
    RegistrationModel,
    ClassModel,
    AnnouncementModel,
    AnnouncementSetModel,
    ResourcesModel,
    ModuleModel,
    LessonModel,
    LessonSetModel,
    CompletedLessonsModel,
    AssignmentSetModel,
    AssignmentModel,

    // Schema
    UserSchema,
    RegistrationSchema,
    ClassSchema,
    AnnouncementSchema,
    AnnouncementSetSchema,
    ResourceSchema,
    ModuleSchema,
    LessonSchema,
    LessonSetSchema,
    CompletedLessonSchema,
    AssignmentSetSchema,
    AssignmentSchema,
}