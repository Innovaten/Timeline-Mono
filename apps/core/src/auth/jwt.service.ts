import { Injectable } from "@nestjs/common";
import { IUserDoc, UserModel } from "@repo/models";
import { config } from "@repo/config";
import { sign, verify } from 'jsonwebtoken'


@Injectable()
export class JwtService {
    async validateToken(token: string ) {
        const payload: any = verify(token, config.secrets.core);
        if (payload.sub){
            const user = await UserModel.findById(payload.sub);
            return user;
        }
    }

    async signToken(userDoc: IUserDoc){
        const payload = { username: userDoc.email, sub: userDoc._id }
        return sign(payload, config.secrets.core, { expiresIn: '4h'})
    }
}
