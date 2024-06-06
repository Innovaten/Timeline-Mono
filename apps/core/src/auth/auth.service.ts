import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import { UserModel, IUserDoc } from '../../../../packages/models/src/index';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<IUserDoc | null> {
        const user = await UserModel.findOne({ email });
        if(user && await bcrypt.compare(password, user.auth.password)) {
            return user;
        }
        return null;

    }
    async login(user: IUserDoc) {
        const payload = { username: user.email, sub: user._id }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}