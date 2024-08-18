import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { CoreConfig } from './config';
import { NextFunction, Request, Response } from 'express';
import expressListRoutes from 'express-list-routes';

async function bootstrap() {
  console.log('Here 1')
  const app = await NestFactory.create(AppModule, { logger: false });
  app.enableCors({
    origin: '*',
  }) 
  console.log('Here 2')
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Authorization,Content-Type');
    next();
  });
  // Disable in Prod
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
  })
  console.log('Here 3')
  
  await app.listen(CoreConfig.ports.core, () => {
    console.log(`Running CORE on port {${CoreConfig.ports.core}}`)
  });

  const server = app.getHttpServer();
  const router = server._events.request._router;
  expressListRoutes(router);
}
bootstrap();