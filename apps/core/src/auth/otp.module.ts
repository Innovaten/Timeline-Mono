import { Module } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { OtpController } from "./otp.controller";
import { UserService } from "../common/services/user.service";
import { KafkaService } from "../common/services/kafka.service";

@Module({
    providers: [OtpService, UserService, KafkaService],
    controllers: [OtpController],
})

export class OtpModule {}