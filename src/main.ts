import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'dotenv/config';
import * as cluster from 'cluster';
import { cpus } from 'os';
import * as compression from "compression"
import { RedisIoAdapter } from './adapters/RedisoIoAdapter';

const cpuLength = cpus().length;

/**
 * Bootstraping application
 */
async function bootstrap() {
  if (cluster.isMaster) {
    for (let i = 0; i < cpuLength - 1; i++) {
      cluster.fork();
    }
  } else {
    await startApplication();
  }
}

bootstrap();

/**
 * Start application with required parameters
 */
async function startApplication() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  app.use(compression());
  app.enableCors();
  await app.listen(process.env.PORT);
}
