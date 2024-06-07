import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { config } from "@repo/config"
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  await mongoose.connect(config.db.uri, {
    dbName: config.db.database
  });
  console.log('--- MongoDB Connected ---');
  console.log('URI: ', config.db.uri, "  DB: ", config.db.database)
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  })

  await app.listen(5000);
}
bootstrap();
