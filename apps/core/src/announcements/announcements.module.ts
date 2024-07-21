import { Module } from '@nestjs/common';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { JwtService } from '../common/services/jwt.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { ClassesService } from '../classes/classes.service';

@Module({
  controllers: [AnnouncementsController],
  providers: [ AnnouncementsService, JwtService, AuthGuard, ClassesService ]
})
export class AnnouncementsModule {}
