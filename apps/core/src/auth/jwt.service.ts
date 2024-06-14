import { Injectable } from "@nestjs/common";
import { IUserDoc, UserModel } from "@repo/models";
import { sign, verify } from 'jsonwebtoken'
const configModule = require("@repo/config");


@Injectable()
export class JwtService {
    async validateToken(token: string ) {
        const payload: any = verify(token, configModule.config.secrets.core);
        if (payload.sub){
            const user = await UserModel.findById(payload.sub);
            return user;
        }
    }

    async signToken(userDoc: IUserDoc){
        const payload = { username: userDoc.email, sub: userDoc._id }
        return sign(payload, configModule.config.secrets.core, { expiresIn: '4h'})
    }
}
