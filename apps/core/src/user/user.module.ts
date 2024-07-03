import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UserService } from '../common/services/user.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';
import { KafkaService } from '../common/services/kafka.service';

@Module({
  providers: [UserService, AuthGuard, JwtService, KafkaService],
  controllers: [UsersController]
})
export class UserModule {}
