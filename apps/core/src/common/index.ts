import {  Module } from "@nestjs/common";
import { JwtService } from "./services/jwt.service";
import { UserService } from "./services/user.service";
import { AuthGuard } from "./guards/jwt.guard";

@Module({
    providers: [JwtService, UserService, AuthGuard],
    exports: [JwtService, UserService, AuthGuard]
})

export default class CustomCommon {}