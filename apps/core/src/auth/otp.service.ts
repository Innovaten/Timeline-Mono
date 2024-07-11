import { Injectable } from "@nestjs/common";
import { UserService } from "../common/services/user.service";
import { KafkaService } from "../common/services/kafka.service";
import { ServerErrorResponse, ServerSuccessResponse } from "../common/entities/responses.entity";
import lodash from 'lodash';


@Injectable()
export class OtpService {
    constructor(
        private readonly user: UserService,
        private readonly kafkaService: KafkaService,
    
    ) {}


    async sendOtp(email: string, via: string = 'email') {
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
        await user.save()

        let topic: string;
        let data: Record<string, any>;

        if(via === 'phone') {
            const { smsBodyTemplates } = await import("../../../services/src/handlers/templates/sms-templates.js")
            topic = "notifications.send-sms",
            data = { phone: user.phone, otp, body: smsBodyTemplates['otp']({ otp }) }
        } else {
            const { emailSubjectTemplates, emailBodyTemplates } = await import("../../../services/src/handlers/templates/email-templates.js")
            topic = "notifications.send-email";
            data = { email: user.email, otp, subject: emailSubjectTemplates['otp']({ otp }), body: emailBodyTemplates['otp']({ otp }) }
        }

        const messageSent = await this.kafkaService.produceMessage(
            "notifications.send-email",
            "otp",
            data,
        );

        if (!messageSent) {
            return ServerErrorResponse(new Error('Failed to sent OTP email'), 500)
        }

        return ServerSuccessResponse({ message: 'OTP sent successfully', email: user.email });
    }
}