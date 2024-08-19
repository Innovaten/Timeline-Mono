import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ClassesModule } from './classes/classes.module'
import { RegistrationsModule } from './registrations/registrations.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AssetsModule } from './assets/assets.module';
import CustomCommon from './common';
import { ModulesModule } from './modules/module.module';
import { LessonsModule } from './lessons/lessons.module';
import { AssignmentsModule } from './assignments/assignments.module';

@Module({
  imports: [
    CustomCommon,
    AuthModule,
    UserModule,
    RegistrationsModule,
    ClassesModule,
    AnnouncementsModule,
    AssetsModule,
    ModulesModule,
    LessonsModule,
    AssignmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomCommon],
})
export class AppModule {}
