import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertestRequest from 'supertest';
import { ServiceCompanyController } from '../../src/home/controllers/service-company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionParameters } from '../connections/connection';
import * as fakerStatic from 'faker';
import { BullModule } from '@nestjs/bull';
import { HomeModule } from '../../src/home/home.module';

/**
 * Testing Service controller api
 */
describe('Service Controller tests', () => {
  let app: INestApplication;
  let serviceController: ServiceCompanyController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        HomeModule,
        TypeOrmModule.forRoot({
          ...connectionParameters,
          entities: ['./**/*.entity.ts'],
        }),
        BullModule.registerQueueAsync(
          {
            name: 'audio',
            useFactory: () => ({
              redis: {
                host: 'localhost',
                port: 6379,
              },
            }),
          },
        ),
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    serviceController = moduleRef.get<ServiceCompanyController>(ServiceCompanyController);
    await app.init();
  });

  it('GET /api/service/all', () => {
    return supertestRequest(app.getHttpServer())
      .get('/api/service/all').expect(200);
  });

  it('POST /api/service', async () => {
    return supertestRequest(app.getHttpServer())
      .post('/api/service/')
      .set('Content-Type', 'multipart/form-data')
      .attach('file', 'src/public/services/example.png')
      .field('name', fakerStatic.name.title())
      .expect(201);
  });
  afterAll(async () => {
    await app.close();
  });
});