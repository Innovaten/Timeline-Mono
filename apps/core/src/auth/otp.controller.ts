import { Controller, Get, Query } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { ServerErrorResponse } from "../common/entities/responses.entity";


@Controller('otp')
export class OtpController {
    constructor(private readonly otpService: OtpService) {}

    @Get('send')
    async sendOtp(@Query('email') email: string, @Query('via') via: string ) {
        try {
            return this.otpService.sendOtp(email, via)
        } catch (error) {
            return ServerErrorResponse(new Error('Cannot send Email'), 500)
        }    
    }
}