import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UserService } from '../common/services/user.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';
import { KafkaService } from '../common/services/kafka.service';
import { ClassesService } from '../classes/classes.service';
import { AnnouncementsService } from '../announcements/announcements.service';

@Module({
  providers: [UserService, AuthGuard, JwtService, KafkaService, ClassesService, AnnouncementsService],
  controllers: [UsersController]
})
export class UserModule {}
