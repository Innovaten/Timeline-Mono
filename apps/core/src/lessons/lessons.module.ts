import { Module } from '@nestjs/common';
import { LessonsController } from './lesson.controller';
import { LessonsService } from './lessons.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';

@Module({
  providers: [
    LessonsService,
    AuthGuard,
    JwtService,
  ],
  controllers: [LessonsController],
})
export class LessonsModule {}
