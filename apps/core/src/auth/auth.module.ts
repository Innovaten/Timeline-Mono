import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import CustomCommon from "../common";
import { AuthController } from "./auth.controller";
import { OtpModule } from "./otp.module";

@Module({
    imports: [
        CustomCommon,
        OtpModule,
    ],
    providers: [AuthService],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}