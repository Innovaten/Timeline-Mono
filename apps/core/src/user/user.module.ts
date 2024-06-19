import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../common/services/user.service';

@Module({
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
