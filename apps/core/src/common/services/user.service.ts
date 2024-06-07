import { Injectable } from "@nestjs/common";
import { compare } from "bcrypt";
import { UserModel } from "@repo/models";

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

}