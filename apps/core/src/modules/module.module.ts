import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesController } from './module.controller';
import { ModulesService } from './module.service';
import { LessonSetsService } from '../common/services/lessonsets.service';
import { CompletedLessonsService } from '../common/services/completedlessons.service';
import { ModuleSchema, LessonSetSchema, CompletedLessonSchema } from '@repo/models';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Module', schema: ModuleSchema },
      { name: 'LessonSet', schema: LessonSetSchema },
      { name: 'CompletedLesson', schema: CompletedLessonSchema },
    ]),
  ],
  providers: [
    ModulesService,
    LessonSetsService,
    CompletedLessonsService,
    AuthGuard,
    JwtService,
  ],
  controllers: [ModulesController],
})
export class ModulesModule {}
