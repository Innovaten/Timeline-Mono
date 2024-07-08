import { Injectable } from "@nestjs/common";
import { compare } from "bcrypt";
import {  UserModel } from "@repo/models";
import { CreateUserDto, UpdateUserDto } from "../../user/user.dto";
import lodash from "lodash";
import { Types } from "mongoose";
import { generate } from 'generate-password'
import bcrypt from 'bcrypt'
import { Roles } from "../enums/roles.enum";
import { KafkaService } from "./kafka.service";
import { IRegistration } from "../../../../../packages/models/src/registration/index.types";

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
        const results = await UserModel.find(filter ?? {}).limit(limit ?? 10).skip(offset ?? 0).sort({ createdAt: -1})
        return results;
    }

    async getCount(filter?: Record<string, any>){
        return UserModel.countDocuments(filter)
    }

    async createAdmin(userData: CreateUserDto, creator: string){

        const codePrefix = userData.role == "SUDO" ? "SDO" : "ADM"

        let randomPassword = generate({ 
            length: 7, 
            strict: true 
        })

        randomPassword = randomPassword + ["!","@","#","$","^","*","&"][ Math.floor(Math.random() * 6) ] + [Math.abs(Math.floor((Math.random() * 149)-97))]

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(randomPassword, salt);

        const { authToken, ...actualData } = userData;

        const user = new UserModel({
            code: codePrefix + lodash.padStart(`${await(UserModel.countDocuments()) + 1}`, 6, "0"),
            ...actualData,
            meta: {
                isPasswordSet: false,
                isSuspended: false,
                isDeleted: false,
            },
            auth: {
                password: passwordHash,
            },
            createdBy: new Types.ObjectId(creator),
            createdAt: new Date(),
            courses: [],
        })

        await user.save()

        await this.kafka.produceMessage(
            "notifications.send-email",
            "admin-credentials",
            {
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

    async createStudent(userData: IRegistration){

        if(userData.status !== "Accepted"){
            throw new Error("Registration not accepted yet")
        }
        else{
        const codePrefix = "STU"

        let randomPassword = generate({ 
            length: 7, 
            strict: true 
        })
  
        randomPassword = randomPassword + ["!","@","#","$","^","*","&"][ Math.floor(Math.random() * 6) ] + [Math.abs(Math.floor((Math.random() * 149)-97))]

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(randomPassword, salt);
        

        const user = new UserModel({
            code: codePrefix + lodash.padStart(`${await(UserModel.countDocuments()) + 1}`, 6, "0"),
            role: Roles.STUDENT,
            firstName: userData.firstName,
            otherNames: userData.otherNames,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            gender: userData.gender,
            
            meta: {
                isPasswordSet: false,
                isSuspended: false,
                isDeleted: false,
            },
            auth: {
                password: passwordHash,
            },
            createdAt: new Date(),
            classes: userData.approvedClasses,
        })

        await user.save()

        await this.kafka.produceMessage(
            "notifications.send-email",
            "student-credentials",
            {
                email: user.email,
                code: user.code,
                password: randomPassword,
                firstName: user.firstName,
            }
        )
        return user;

    }
}

async getAdminCount(){
    const count = await UserModel.find({role:'ADMIN'});
    return count.length;
}

}

