import { BadRequestException, Injectable } from "@nestjs/common";
import { compare } from "bcrypt";
import { CompletedLessonsModel, ICompletedLessonDoc, ClassModel, ILessonDoc, UserModel, IUserDoc, IAssignmentDoc, AssignmentModel } from "@repo/models";
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
        const filter = { email, ...extraFilter }
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
            .find(filter ?? {})
            .populate("classes")
            .limit(limit ?? 10)
            .skip(offset ?? 0)
            .sort({ createdAt: -1})
        return results;
    }

    async getCount(filter?: Record<string, any>){
        return UserModel.countDocuments(filter)
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
            code: await generateCode(await UserModel.countDocuments({ role: userData.role }), codePrefix),
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
        await user.save()

        return user
    }

    async downgradeToAdmin(sudoId: string) {
        const user = await UserModel.findById(new Types.ObjectId(sudoId))

        if(!user) {
            throw new Error("User not found")
        }

        user.role = Roles.ADMIN
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
            code: await generateCode(await UserModel.countDocuments({ role: "STUDENT"}), "STU"),
            role: Roles.STUDENT,
            firstName: userData.firstName,
            otherNames: userData.otherNames,
            lastName: userData.lastName,
            email: userData.email,
            phone: `${validPhoneNumber(userData.phone)}`,
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

    async getUserAssignments(specifier: string, isId: boolean, requestingUser: IUserDoc){

        const filter = isId ? { _id: new Types.ObjectId(specifier)} : { code: specifier }

        if(requestingUser.role == "SUDO"){
            return AssignmentModel.find({ meta: { isDeleted: false } }).populate("createdBy updatedBy")
        }

        const user = await UserModel.findOne(filter).populate<{ classes?: { assignmentSet?: { assignments?: IAssignmentDoc[] } }}>({
            path: "classes",
            populate: {
                path: "assignmentSet",
                populate: {
                    path: "assignments",
                    populate: "createdBy updatedBy"
                }
            }
        })

        return user?.classes?.assignmentSet?.assignments ?
            user?.classes?.assignmentSet?.assignments?.filter(a => a.accessList.map(a => a._id.toString()).includes(`${user._id}`) && a.meta.isDeleted == false ) :
            []
    }
}

