import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // @ts-expect-error  Type 'CorsOptionsDelegate<any>' has no properties in common with type 'FastifyCorsOptions'
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      enableDebugMessages: process.env.NODE_ENV === 'development',
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
