import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { JwtService } from '../common/services/jwt.service';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService, JwtService]
})
export class AssetsModule {}
