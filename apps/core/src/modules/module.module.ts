import { Module } from '@nestjs/common';
import { ModulesController } from './module.controller';
import { ModulesService } from './module.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';
import { AssignedService } from '../common/services/assigned.service';

@Module({
  providers: [
    ModulesService,
    AuthGuard,
    JwtService,
    AssignedService,
  ],
  controllers: [ModulesController],
})
export class ModulesModule {}
