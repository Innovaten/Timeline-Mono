import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import {  MongooseModule } from '@nestjs/mongoose'
import { AuthService } from "./auth.service";
import { UserModel, UserSchema } from "../../../../packages/models/src";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'evfdosqJf',
            signOptions: { expiresIn: '120m' }, 
        }),
        MongooseModule.forFeature([{ name: UserModel.modelName, schema: UserSchema }]),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}