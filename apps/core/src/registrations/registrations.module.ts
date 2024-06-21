import { Module } from '@nestjs/common';
import { RegistrationsController } from './registrations.controller';
import { RegistrationsService } from './registrations.service';
import { UserService } from '../common/services/user.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';

@Module({
  controllers: [RegistrationsController],
  providers: [RegistrationsService, UserService, AuthGuard, JwtService]
})
export class RegistrationsModule {}
