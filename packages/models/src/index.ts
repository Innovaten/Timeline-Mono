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
import { CompletedModulesSchema, CompletedModulesModel } from "./completed-modules";
import { AssignmentSetModel, AssignmentSetSchema } from "./assignment-set";
import { AssignmentModel, AssignmentSchema } from "./assignment";
import { AssignmentSubmissionModel, AssignmentSubmissionSchema } from "./assignment-submission";

import { IUserDoc } from "./user/index.types";
import { IRegistrationDoc } from "./registration/index.types";
import { IClassDoc } from "./class/index.types";
import { IAnnouncementDoc } from "./announcement/index.types";
import { IAnnouncementSetDoc } from "./announcement-set/index.types";
import { IResourceDoc } from "./resource/index.types";
import { IModuleDoc } from "./module/index.types";
import { ILessonDoc, ILesson } from "./lessons/index.types";
import { ILessonSetDoc } from "./lessonSet/index.types";
import { ICompletedLessonDoc } from "./completedLessons/index.types";
import { ICompletedModuleDoc } from "./completed-modules/index.types";
import { IAssignmentSet, IAssignmentSetDoc } from "./assignment-set/index.types";
import { IAssignment, IAssignmentDoc } from "./assignment/index.types";
import { IAssignmentSubmission, IAssignmentSubmissionDoc, AssignmentSubmissionStatusType } from "./assignment-submission/index.types";

( async function index(){
    await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE
    });
    console.log('--- MongoDB Connected ---');
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
    type ILesson,
    type ILessonSetDoc,
    type ICompletedLessonDoc,
    type ICompletedModuleDoc,
    type IAssignmentSet,
    type IAssignmentSetDoc,
    type IAssignment,
    type IAssignmentDoc,
    type IAssignmentSubmission,
    type IAssignmentSubmissionDoc,
    type AssignmentSubmissionStatusType,

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
    CompletedModulesModel,
    AssignmentSetModel,
    AssignmentModel,
    AssignmentSubmissionModel,

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
    CompletedModulesSchema,
    AssignmentSetSchema,
    AssignmentSchema,
    AssignmentSubmissionSchema,

}