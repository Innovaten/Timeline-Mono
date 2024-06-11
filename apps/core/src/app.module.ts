import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import CustomCommon from './common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomCommon,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomCommon],
})
export class AppModule {}
