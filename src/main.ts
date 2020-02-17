import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'dotenv/config';
import * as path from 'path';
import * as cluster from 'cluster';
import { cpus } from 'os';

const cpuLength = cpus().length;

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

async function startApplication() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(path.join(__dirname, '../public'));
  await app.listen(process.env.PORT);
}
