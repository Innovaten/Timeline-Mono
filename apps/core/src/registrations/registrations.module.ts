import { Module } from '@nestjs/common';
import { RegistrationsController } from './registrations.controller';
import { RegistrationsService } from './registrations.service';
import { UserService } from '../common/services/user.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';
import { KafkaService } from '../common/services/kafka.service';

@Module({
  controllers: [RegistrationsController],
  providers: [RegistrationsService, UserService, AuthGuard, JwtService, KafkaService]
})
export class RegistrationsModule {}
