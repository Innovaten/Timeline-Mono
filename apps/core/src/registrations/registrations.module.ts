import { Module } from '@nestjs/common';
import { RegistrationsController } from './registrations.controller';
import { RegistrationsService } from './registrations.service';
import { UserService } from '../common/services/user.service';

@Module({
  controllers: [RegistrationsController],
  providers: [RegistrationsService, UserService]
})
export class RegistrationsModule {}
