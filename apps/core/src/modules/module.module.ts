import { Module } from '@nestjs/common';
import { ModulesController } from './module.controller';
import { ModulesService } from './module.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';

@Module({
  providers: [
    ModulesService,
    AuthGuard,
    JwtService,
  ],
  controllers: [ModulesController],
})
export class ModulesModule {}
