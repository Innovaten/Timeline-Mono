import { Injectable } from "@nestjs/common";
import { IClassDoc, IUserDoc, UserModel } from "@repo/models";
import { sign, verify } from 'jsonwebtoken'
import { CoreConfig } from "../../config";
import { Types } from "mongoose";


@Injectable()
export class JwtService {
    async validateToken(token: string ) {
        const payload: any = verify(token, CoreConfig.secrets.core);
        if (payload.sub){
            const user = await UserModel.findById(payload.sub);
            return user;
        } else {
            return null;
        }
    }

    signToken(userDoc: Omit<IUserDoc, "classes" > & { classes?: IClassDoc[] } ){
        const payload = { username: userDoc.email, sub: userDoc._id }
        return sign(payload, CoreConfig.secrets.core, { expiresIn: '3h'})
    }
}
