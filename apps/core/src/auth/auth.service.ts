import { Injectable } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import { UserService } from "../common/services/user.service";
import { ServerErrorResponse, ServerSuccessResponse } from "../common/entities/responses.entity";

@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        private users: UserService ,
    ) {}

    async login(email: string, password: string) {
        try {
            const user = await this.users.verifyPassword(email, password)
            if(!user){
                return ServerErrorResponse(new Error(`Invalid email or password`), 401)
            }
            const token = this.jwt.signToken(user)
            return ServerSuccessResponse({
                user: user,
                access_token: token,
            })
        } catch (err) {
            return ServerErrorResponse(err, 500)
        }
    }

    // forgot-password
    // verify-otp?email=${email}otp=${otp}
    // update-password


    // register
}