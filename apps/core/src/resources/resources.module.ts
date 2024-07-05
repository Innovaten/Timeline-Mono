import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { ResourcesController } from './resources.controller';
import { JwtService } from '../common/services/jwt.service';

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService,AuthGuard, JwtService]
})
export class ResourcesModule {}
