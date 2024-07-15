import { Injectable } from "@nestjs/common";
import { UserService } from "../common/services/user.service";
import { KafkaService, KafkaTopic } from "../common/services/kafka.service";
import { ServerErrorResponse, ServerSuccessResponse } from "../common/entities/responses.entity";
import lodash from 'lodash';

@Injectable()
export class OtpService {
    constructor(
        private readonly user: UserService,
        private readonly kafkaService: KafkaService,
    
    ) {}


    async sendOtp(email: string, via: string) {
        const user = await this.user.getUserByEmail(email)
        if (!user) {
            return ServerErrorResponse(new Error('User could not be found'), 404)
        }

        const otpLastSentAt = user.auth?.otpLastSentAt;
        const currentTime = new Date();
        if (otpLastSentAt) {
            const timeDiff = (currentTime.getTime() - new Date(otpLastSentAt).getTime()) / 1000
            if (timeDiff < 90) {
                return ServerErrorResponse(new Error('OPT sent less than 90 seconds ago'), 400)
            }
        }


        const otp = lodash.random(100000, 999999).toString()

        user.auth.otp = otp
        user.auth.otpLastSentAt = currentTime
        user.auth.otp_expiry = new Date(currentTime.getTime() + 5 * 60000)
        await user.save()

        let topic: KafkaTopic;
        let data: Record<string, any>;
        
        if(via === 'phone') {
            topic = "notifications.send-sms",
            data = { phone: user.phone, otp }
        } else {
            topic = "notifications.send-email";
            data = { email: user.email, otp }
        }

        const messageSent = await this.kafkaService.produceMessage(
            topic,
            "otp",
            data,
        );

        if (!messageSent) {
            return ServerErrorResponse(new Error('Failed to send OTP email'), 500)
        }

        return ServerSuccessResponse({ message: 'OTP sent successfully', email: user.email });
    }

    async verifyOtp(email: string, otp: string){

        const user = await this.user.getUserByEmail(email)
        if (!user) {
            return ServerErrorResponse(
                new Error('Specified user could not be found'), 
                404
            );
        }

        const currentTime = new Date();

        // all these fields have to be set in the send func.
        if(!user.auth.otp || !user.auth.otp_expiry || !user.auth.otpLastSentAt){ 
            return ServerErrorResponse(
                new Error("User has not requested an OTP"), 
                400
            );
        }

        if(currentTime.getTime() > new Date(user.auth.otp_expiry).getTime()){
            return ServerErrorResponse(
                new Error('Your OTP has expired'), 
                400
            );
        }


        if(otp !== user.auth.otp){
            return ServerErrorResponse(
                new Error('Invalid OTP'),
                400
            )
        }

        // reset values
        user.auth.otp = undefined
        user.auth.otp_expiry = undefined
        await user.save()

        console.log("Verified OTP for user", user.code);
        return ServerSuccessResponse("OTP verified successfully");
        
    }  
}