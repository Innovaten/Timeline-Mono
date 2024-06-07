import {  Module } from "@nestjs/common";
import { JwtService } from "../auth/jwt.service";
import { UserService } from "./services/user.service";

@Module({
    providers: [JwtService, UserService],
    exports: [JwtService, UserService]
})

export default class CustomCommon {}