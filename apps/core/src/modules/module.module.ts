import { Module } from '@nestjs/common';
import { ModulesController } from './module.controller';
import { ModulesService } from './module.service';
import { LessonSetsService } from '../common/services/lessonsets.service';
import { CompletedLessonsService } from '../common/services/completedlessons.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';

@Module({
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
