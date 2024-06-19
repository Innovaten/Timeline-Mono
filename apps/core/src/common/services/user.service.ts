import { Injectable } from "@nestjs/common";
import { compare } from "bcrypt";
import { RegistrationModel, UserModel } from "@repo/models";
import { ServerErrorResponse, ServerSuccessResponse } from "../entities/responses.entity";
import lodash from 'lodash'
import { IRegistrationDoc } from "@repo/models";
import { RegistrationDTO } from "../../registrations/registrations.dto";

@Injectable()
export class UserService {
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

    async createNewRegistration(regData: RegistrationDTO){

        try {
            const newCode =  "REG" + lodash.padStart(`${await(RegistrationModel.countDocuments()) + 1}`, 6, "0");
            const registration = new RegistrationModel({
                ...regData,
                code: newCode,
            });

            await registration.save();
            console.log(`Created new registration: ${registration.code}`)
            return ServerSuccessResponse<IRegistrationDoc>(registration)
        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500)
        }
    }
}