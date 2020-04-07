import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HomeModule } from '../../src/home/home.module';
import * as request from 'supertest';
import { ServiceCompanyController } from '../../src/home/controllers/service-company.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { connectionParameters } from '../connections/connection';
import { OrderEntity } from '../../src/entities/order.entity';
import { User } from '../../src/entities/user.entity';
import { ServiceCompanyEntity } from '../../src/entities/service.company.entity';
import { ServiceCompanyService } from '../../src/home/services/ServiceCompanyService';
import { FileService } from '../../src/shared/services/file.service';
import { Repository } from 'typeorm';
import { HomeProvider } from '../../src/home/providers/home-provider';

/**
 * Testing Service controller api
 */
describe('Service Controller tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...connectionParameters,
          entities: [OrderEntity, User, ServiceCompanyEntity],
        }),
      ],
      controllers: [ServiceCompanyController],
      providers: [ServiceCompanyService, FileService, {
        provide: getRepositoryToken(ServiceCompanyEntity),
        useClass: Repository,
      },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        ...HomeProvider,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('GET /api/service/all', () => {
    return request(app.getHttpServer())
      .get('/api/service/all').expect(200);
  });
});