import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserModel, IUserDoc } from "../../../../packages/models/src";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'BQOCUFHOEWF'
        })
    }

    async validate(payload: any) {
        const user = await UserModel.findById(payload.sub);
        if(!user) {
            throw new UnauthorizedException()
        }
        return user;
    }
}
