import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { JwtService } from '../common/services/jwt.service';
import { AuthGuard } from '../common/guards/jwt.guard';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService, JwtService, AuthGuard]
})
export class AssetsModule {}
