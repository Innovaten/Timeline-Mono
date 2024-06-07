import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import CustomCommon from "../common";
import { AuthController } from "./auth.controller";

@Module({
    imports: [CustomCommon],
    providers: [AuthService],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}