import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';

@Module({
  providers: [ClassesService, AuthGuard, JwtService],
  controllers: [ClassesController]
})
export class ClassesModule {}
