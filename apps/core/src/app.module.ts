import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RegistrationsModule } from './registrations/registrations.module';
import CustomCommon from './common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomCommon,
    AuthModule,
    UserModule,
    RegistrationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomCommon],
})
export class AppModule {}
