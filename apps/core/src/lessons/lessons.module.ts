import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonsController } from './lesson.controller';
import { LessonsService } from './lessons.service';
import { LessonSetsService } from '../common/services/lessonsets.service';
import { CompletedLessonsService } from '../common/services/completedlessons.service';
import { LessonSchema, LessonSetSchema, CompletedLessonSchema } from '@repo/models';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Lesson', schema: LessonSchema },
      { name: 'LessonSet', schema: LessonSetSchema },
      { name: 'CompletedLesson', schema: CompletedLessonSchema },
    ]),
  ],
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
