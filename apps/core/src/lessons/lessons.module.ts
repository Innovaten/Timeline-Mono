import { Module } from '@nestjs/common';
import { LessonsController } from './lesson.controller';
import { LessonsService } from './lessons.service';
import { LessonSetsService } from '../common/services/lessonsets.service';
import { CompletedLessonsService } from '../common/services/completedlessons.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';

@Module({
  providers: [
    LessonsService,
    LessonSetsService,
    CompletedLessonsService,
    AuthGuard,
    JwtService,
  ],
  controllers: [LessonsController],
})
export class LessonsModule {}
