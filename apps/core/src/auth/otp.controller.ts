import { Controller, Get, Query } from "@nestjs/common";
import { OtpService } from "./otp.service";


@Controller('otp')
export class OtpController {
    constructor(private readonly otpService: OtpService) {}

    @Get('send')
    async sendOtp(@Query('email') email: string) {
        return this.otpService.sendOtp(email)
    }
}