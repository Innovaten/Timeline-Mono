import { Module } from '@nestjs/common';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';

@Module({
  controllers: [AssignmentsController],
  providers: [AssignmentsService, AuthGuard, JwtService]
})
export class AssignmentsModule {}
