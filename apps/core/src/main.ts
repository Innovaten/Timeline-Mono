import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { VersioningType } from '@nestjs/common';
const configModule = require("@repo/config");

async function bootstrap() {

  await mongoose.connect(configModule.config.db.uri, {
    dbName: configModule.config.db.database
  });
  console.log('--- MongoDB Connected ---');
  console.log('URI: ', configModule.config.db.uri, "  DB: ", configModule.config.db.database)
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
  })

  await app.listen(5000);
}
bootstrap();
