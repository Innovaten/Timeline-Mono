import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { VersioningType } from '@nestjs/common';
import { CoreConfig } from './config';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {

  console.log(CoreConfig.db.uri)

  await mongoose.connect(CoreConfig.db.uri, {
    dbName: CoreConfig.db.database
   });
   console.log('--- MongoDB Connected ---');
   console.log('URI: ', CoreConfig.db.uri, "  DB: ", CoreConfig.db.database)

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  })
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });
  // Disable in Prod
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
  })

  await app.listen(CoreConfig.ports.core, () => {
    console.log(`Running CORE on port {${CoreConfig.ports.core}}`)
  });
}
bootstrap();
