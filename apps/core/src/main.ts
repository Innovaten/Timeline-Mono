import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { VersioningType } from '@nestjs/common';
import { CoreConfig } from './config';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  })
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', '*');
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
