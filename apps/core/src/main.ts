import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { VersioningType } from '@nestjs/common';
import { CoreConfig } from './config';

async function bootstrap() {

  await mongoose.connect(CoreConfig.db.uri, {
    dbName: CoreConfig.db.database
  });
  console.log('--- MongoDB Connected ---');
  console.log('URI: ', CoreConfig.db.uri, "  DB: ", CoreConfig.db.database)

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
  })
  await app.listen(CoreConfig.ports.core, () => {
    console.log(`Running CORE on port {${CoreConfig.ports.core}}`)
  });
}
bootstrap();
