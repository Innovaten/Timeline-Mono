import { BadRequestException, Injectable, ForbiddenException } from "@nestjs/common";
import { compare } from "bcrypt";
import { CompletedLessonsModel, ICompletedLessonDoc, ClassModel, ILessonDoc, UserModel, IUserDoc, IAssignmentDoc, AssignmentModel, AssignmentSubmissionModel, AssignmentSubmissionStatusType, ModuleModel, CompletedLessonSchema, CompletedModulesModel, ICompletedModuleDoc, IModuleDoc, LessonModel, LessonSetModel } from "@repo/models";

import { CreateUserDto, UpdateUserDto } from "../../user/user.dto";
import { Types } from "mongoose";
import { Roles } from "../enums/roles.enum";
import { KafkaService } from "./kafka.service";
import { IRegistrationDoc } from "@repo/models";
import { generateCode, generateSecurePassword, validPhoneNumber } from "../../utils";
import { CoreConfig } from "../../config";
import { ServerErrorResponse, ServerSuccessResponse } from "../entities/responses.entity";

@Injectable()
export class UserService {
    constructor(
        private kafka: KafkaService
    ) { }

    async verifyPassword(email: string, password: string, extraFilter: Record<string, any> = {}) {
        const filter = { email, ...extraFilter, "meta.isDeleted": false}
        const user = await UserModel.findOne(filter);
        if(!user) return null;
        const isSamePassword = await compare(password, user.auth.password)
        if(isSamePassword){
            return user;
        } else { return null };
    }

    async getUserByEmail(email: string){
        return await UserModel.findOne({ email });

    }

    async getUserById(id: string) {
        return await UserModel.findById({ id })
    }
    

    async getUsers(limit?: number, offset?: number, filter?: Record<string, any>){
        const results = await UserModel
            .find({
                ...(filter ?? {}),
                "meta.isDeleted": false
            })
            .populate("classes")
            .limit(limit ?? 10)
            .skip(offset ?? 0)
            .sort({ createdAt: -1})
        return results;
    }

    async getCount(filter?: Record<string, any>){
        return UserModel.countDocuments({
            ...filter,
            "meta.isDeleted": false,
        })
    }

    async createAdmin(userData: CreateUserDto, creator: string){

        const existingAdmin = await UserModel.findOne({email: userData.email });

        if(existingAdmin){
            throw new Error("A user with the specified email already exists.")
        }

        const codePrefix = userData.role == "SUDO" ? "SDO" : "ADM"

        const randomPassword = generateSecurePassword()

        const { authToken, phone, ...actualData } = userData;

        const user = new UserModel({
            code: await generateCode(await UserModel.countDocuments({ code: { ...(userData.role == "SUDO" ? {$regex: /SDO/} : { $regex: /ADM/})} }), codePrefix),
            ...actualData,
            phone: `+${validPhoneNumber(phone)}`,
            meta: {
                isPasswordSet: false,
                isSuspended: false,
                isDeleted: false,
            },
            auth: {
                password: randomPassword,
            },
            createdBy: new Types.ObjectId(creator),
            createdAt: new Date(),
            classes: [],
        })

        await user.save()

        await this.kafka.produceMessage(
            "notifications.send-email",
            "admin-credentials",
            {
                console: CoreConfig.url.admin,
                email: user.email,
                code: user.code,
                password: randomPassword,
                firstName: user.firstName,
            }
        )
        
        return user;

    }

    async upgradeToSudo(adminId: string) {
        const user = await UserModel.findById(new Types.ObjectId(adminId))

        if(!user) {
            throw new Error("User not found")
        }

        user.role = Roles.SUDO;
        user.code = "SDO" + user.code.substring(3)
        await user.save()

        return user
    }

    async downgradeToAdmin(sudoId: string) {
        const user = await UserModel.findById(new Types.ObjectId(sudoId))

        if(!user) {
            throw new Error("User not found")
        }

        user.role = Roles.ADMIN
        user.code = "ADM" + user.code.substring(3)
        await user.save()

        return user
    }

    async updateUser(_id: string, updateUserDto: UpdateUserDto) {

        const user = await UserModel.findByIdAndUpdate(new Types.ObjectId(_id), updateUserDto, { new: true })

        if(!user) {
            throw new Error("User not found")
        }

        return user
    }

    async deleteUser(_id: string, actor: string){

        const user = await UserModel.findById(_id)
        
        if(!user) {
            throw new Error("Specified user not found")
        }

        user.meta.isDeleted = true;
        user.updatedAt = new Date();

        await user.save();
        return user;
    }

    async createStudent(userData: IRegistrationDoc){

        if(userData.status !== "Accepted"){
            throw new Error("Registration has not been accepted")
        }

        const randomPassword = generateSecurePassword()

        const user = new UserModel({
            code: await generateCode(await UserModel.countDocuments(), "STU"),
            role: Roles.STUDENT,
            firstName: userData.firstName,
            otherNames: userData.otherNames,
            lastName: userData.lastName,
            email: userData.email,
            phone: `+${validPhoneNumber(userData.phone)}`,
            gender: userData.gender,
            
            meta: {
                isPasswordSet: false,
                isSuspended: false,
                isDeleted: false,
            },
            auth: {
                password: randomPassword,
            },
            createdAt: new Date(),
            classes: userData.approvedClasses,
        })

        await ClassModel.updateMany({ _id: { $in: userData.approvedClasses }}, {
            $push: {
                students: user._id,
            }
        } )

        const emptyCompletedLessons = new CompletedLessonsModel({
            user: user.id,
            lessons: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        user.completedLessons = emptyCompletedLessons.id;

        await emptyCompletedLessons.save()
        await user.save()

        await this.kafka.produceMessage(
            "notifications.send-email",
            "student-credentials",
            {
                console: CoreConfig.url.lms,
                email: user.email,
                code: user.code,
                password: randomPassword,
                firstName: user.firstName,
            }
        )

        console.log("Created student", user.code, "from registration", userData.code);
        return user;
    }

    async getUserCount(filter?: Record<string, any>){
        const count = await UserModel.countDocuments(filter);
        return count;
    }

    
    async updatePassword (id: string, password: string, otp: string) {
        const user = await this.getUserById(id)
        if (!user) {
            return ServerErrorResponse(new Error('User could not be found'), 404)
        }

        if (otp !== user.auth?.otp) {
            return ServerErrorResponse(new Error('Invalid OTP'), 400)
        }



        user.auth.password = password;


        user.auth.otp = undefined
        user.auth.otpLastSentAt = undefined
        user.auth.otp_expiry = undefined
        await user.save()

        return ServerSuccessResponse({ message: 'Password updated successfully' })

    }

    async getUsersCompletedLessons(specifier: string, isId: boolean): Promise<ICompletedLessonDoc> {
        
        let user: any
        if(isId){
            user = await UserModel.findOne({ _id: new Types.ObjectId(specifier) }).populate<{ completedLessons: { lessons: ILessonDoc[] }}>("completedLessons.lessons")
        } else {
            user = await UserModel.findOne({ code: specifier }).populate<{ completedLessons: { lessons: ILessonDoc[] }}>("completedLessons.lesson")
        }

        if(!user){
            throw new BadRequestException(`Specified user could not be found`)
        }
        return user.completedLessons.lessons;
    }

    async getUserAssignments(requestingUser: IUserDoc){
        if(requestingUser.role == "SUDO"){
            return AssignmentModel.find({ meta: { isDeleted: false} }).populate("createdBy updatedBy").sort({ createdAt: -1}).lean()
        }


        if(requestingUser.role == Roles.ADMIN){
            return AssignmentModel.find({ class: { $in: requestingUser.classes.map(c => `${c}`) }, "meta.isDeleted": false }).populate("createdBy updatedBy").sort({ createdAt: -1}).lean()
        }

        const timestamp = new Date();

        const filter = { 
            class: { 
                $in: requestingUser.classes
            }, 
            "meta.isDeleted": false,
        } 

        const assignments = await AssignmentModel.find(filter).populate("createdBy").sort({ createdAt: -1}).lean()
        const accessibleAssignments = assignments.filter(a => a.accessList.map(id => id.toString()).includes(`${requestingUser._id}`))

        const relatedAssignmentSubmissions = await AssignmentSubmissionModel.find({ submittedBy: requestingUser.id, assignment: { $in: accessibleAssignments.map(a => a._id)} })
        
        for( let i = 0; i< accessibleAssignments.length; i++){

            const assignment = accessibleAssignments[i];

            let relatedAssignmentSubmissionIndex = relatedAssignmentSubmissions.findIndex(s => s.assignment.toString() == assignment._id.toString())

            let status: AssignmentSubmissionStatusType = "Pending";

            if(relatedAssignmentSubmissionIndex == -1){
                if( new Date(assignment.endDate).getTime() < timestamp.getTime() ){
                    status = 'PastDeadline'
                }
            } else {
                const userSubmission = relatedAssignmentSubmissions[relatedAssignmentSubmissionIndex]
                status = userSubmission.status
            }
            // @ts-ignore
            assignment.status = status
        }
        return accessibleAssignments;
    }

    async markAsCompleteLessons(userId: Types.ObjectId, lessonId: Types.ObjectId, lessonSetId: Types.ObjectId): Promise<ICompletedLessonDoc> {
        const completedLesson = await CompletedLessonsModel.findOne({ user: userId, lessonSet: lessonSetId });

        const currentTimestamp = new Date();

        if (completedLesson) {
            const lessonIndex = completedLesson.lessons.findIndex(lesson => lesson.equals(lessonId));

            // Ensure that the update is not too frequent (1 second check)
            if (currentTimestamp.getTime() - completedLesson.updatedAt.getTime() < 1000) {
                throw new BadRequestException('You cannot toggle completion status too quickly.');
            }

            if (lessonIndex === -1) {
                completedLesson.lessons.push(lessonId);
            } else {
                completedLesson.lessons.splice(lessonIndex, 1);
            }

            completedLesson.updatedAt = currentTimestamp;
            await completedLesson.save();
            return completedLesson;
        } else {
            const newCompletedLesson = new CompletedLessonsModel({
                user: userId,
                lessons: [lessonId],
                lessonSet: [lessonSetId],
                createdAt: currentTimestamp,
                updatedAt: currentTimestamp,
            });

            await newCompletedLesson.save();
            return newCompletedLesson;
        }
    }    
    
    async markAsCompleteModule(userId: Types.ObjectId, moduleId: Types.ObjectId): Promise<ICompletedModuleDoc | null> {
        const moduleDoc = await ModuleModel.findById(moduleId).exec();
        
        if (!moduleDoc) {
          throw new Error('Module not found');
        }

        const completedLessonsDoc = await CompletedLessonsModel.findOne({ user: userId }).exec();
        if (!completedLessonsDoc) {
            throw new ForbiddenException('No completed lessons found for this user');
        }
    
        let allLessonsCompleted = await this.areAllLessonsCompleted(moduleDoc.lessonSet, completedLessonsDoc);

        if (!allLessonsCompleted) {
            throw new ForbiddenException('Not all lessons in the module are completed');
        }

        const completedModuleDoc = await CompletedModulesModel.findOne({ user: userId }).exec();
        
    
        const now = new Date();
        if (completedModuleDoc) {

          const moduleIndex = completedModuleDoc.modules.findIndex(id => id.equals(moduleId));
    
          if (moduleIndex > -1) {
            if (now.getTime() - completedModuleDoc.updatedAt.getTime() < 1000) {
              throw new ForbiddenException('Cannot change status too quickly');
            }

            completedModuleDoc.modules.splice(moduleIndex, 1);
          } else {

            completedModuleDoc.modules.push(moduleId);
          }
    
          completedModuleDoc.updatedAt = now;
          await completedModuleDoc.save();
        } else {

          const newCompletedModule = new CompletedModulesModel({
            user: userId,
            modules: [moduleId],
            lessonSet: moduleDoc.lessonSet,
            createdAt: now,
            updatedAt: now,
          });
    
          await newCompletedModule.save();
        }
    
        return completedModuleDoc;
      }

      private async areAllLessonsCompleted(lessonSetId: Types.ObjectId, completedLessonsDoc: any): Promise<boolean> {
        const lessonSet = await LessonSetModel.findById(lessonSetId).populate('lessons').exec();
    
        if (!lessonSet) {
          throw new Error('Lesson set not found');
        }
    
        return lessonSet.lessons.every((lessonId: Types.ObjectId) =>
          completedLessonsDoc.lessons.some((completedLessonId: Types.ObjectId) => completedLessonId.equals(lessonId))
        );
      }

      async getCompletedLessons(userId: Types.ObjectId): Promise<ILessonDoc[] | null> {
        const completedLessons = await CompletedLessonsModel.findOne({ user: userId }).exec();
        const lessons = await LessonModel.find({_id: {$in: completedLessons?.lessons}}).populate("createdBy updatedBy")
        return lessons;
      }

      async getCompletedModules(userId: Types.ObjectId): Promise<IModuleDoc[] | null> {
        const completedModules = await CompletedModulesModel.findOne({ user: userId }).exec();
        const modules = await ModuleModel.find({_id: {$in: completedModules?.modules}}).populate("createdBy updatedBy")
        return modules;
      }
}

