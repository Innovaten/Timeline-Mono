import { Controller, Get, Query } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { ServerErrorResponse } from "../common/entities/responses.entity";


@Controller({
    path: 'auth/otp',
    version: '1',
})

export class OtpController {
    constructor(
        private readonly otpService: OtpService
    ) { }

    @Get('send')
    async sendOtp(
        @Query('email') email: string, 
        @Query('via') via: string 
    ) {
        try {
            return this.otpService.sendOtp(email, via)
        } catch (error) {
            return ServerErrorResponse(new Error(`${error}`), 500)
        }    
    }

    @Get('verify')
    async verifyOtp(
        @Query('email') email: string, 
        @Query('otp') otp: string 
    ) {
        try {
            return this.otpService.verifyOtp(email, otp)
        } catch (error) {
            return ServerErrorResponse(new Error(`${error}`), 500)
        }    
    }
}