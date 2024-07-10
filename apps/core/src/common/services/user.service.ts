import { Injectable } from "@nestjs/common";
import { compare } from "bcrypt";
import {  UserModel } from "@repo/models";
import { CreateUserDto, UpdateUserDto } from "../../user/user.dto";
import lodash from "lodash";
import { Types } from "mongoose";
import bcrypt from 'bcrypt'
import { Roles } from "../enums/roles.enum";
import { KafkaService } from "./kafka.service";
import { IRegistrationDoc } from "@repo/models";
import { generateCode, generateSecurePassword, validPhoneNumber } from "../../utils";
import { CoreConfig } from "../../config";

@Injectable()
export class UserService {
    constructor(
        private kafka: KafkaService
    ) { }

    async verifyPassword(email: string, password: string) {
        const user = await UserModel.findOne({ email });
        if(!user) return null;
        if( await compare(password, user.auth.password)){
            return user;
        } else { return null };
    }

    async getUserByEmail(email: string){
        return UserModel.findOne({ email });

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

}

