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

    async sendOtp(email: string) {
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

        const messageSent = await this.kafkaService.produceMessage(
            "notifications.send-email",
            "otp",
            { email: user.email, otp }
        );

        if (!messageSent) {
            return ServerErrorResponse(new Error('Failed to sent OTP email'), 500)
        }

        return ServerSuccessResponse({ email: user.email })
    }
}