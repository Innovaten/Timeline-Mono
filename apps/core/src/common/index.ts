import {  Module } from "@nestjs/common";
import { JwtService } from "./services/jwt.service";
import { UserService } from "./services/user.service";
import { AuthGuard } from "./guards/jwt.guard";
import { KafkaService } from "./services/kafka.service";
import { AssignedService} from "./services/assigned.service";

@Module({
    providers: [JwtService, UserService, KafkaService, AssignedService, AuthGuard],
    exports: [JwtService, UserService, AssignedService, AuthGuard]
})

export default class CustomCommon {}