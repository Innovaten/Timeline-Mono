import { Injectable } from "@nestjs/common";
import { JwtService } from "../common/services/jwt.service";
import { UserService } from "../common/services/user.service";
import { ServerErrorResponse, ServerSuccessResponse } from "../common/entities/responses.entity";
import { CoreConfig } from "../config";

@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        private users: UserService,
    ) {}

    async login(email: string, password: string, origin: string) {
        try {
            let roles = []
            if(origin == CoreConfig.url.admin){
                roles = ["ADMIN", "SUDO"] 
            } else {
                roles = ["STUDENT"]
            }
            const user = await this.users.verifyPassword(email, password, {role: {$in: roles} })
            if(!user){
                return ServerErrorResponse(new Error(`Invalid email or password`), 401)
            }
            const token = this.jwt.signToken(user)
            return ServerSuccessResponse({
                user: {
                    _id: user._id,
                    id: user.id,
                    classes: user.classes?.map(c => ({ code: c.code, name: c.name, })) ?? [],
                    gender: user.gender,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    otherNames: user.otherNames,
                    role: user.role,
                    modeOfClass: user.modeOfClass,
                    completedLessons: user.completedLessons,
                    meta: {
                        isPasswordSet: user.meta.isPasswordSet,
                        tokenGeneratedAt: new Date(),
                    }
                },
                access_token: token,
            })
        } catch (err) {
            return ServerErrorResponse(new Error(`${err}`), 500)
        }
    }

    // update-password

}