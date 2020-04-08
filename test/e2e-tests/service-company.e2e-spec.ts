import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertestRequest from 'supertest';
import { ServiceCompanyController } from '../../src/home/controllers/service-company.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { connectionParameters } from '../connections/connection';
import { OrderEntity } from '../../src/entities/order.entity';
import { User } from '../../src/entities/user.entity';
import { ServiceCompanyEntity } from '../../src/entities/service.company.entity';
import { ServiceCompanyService } from '../../src/home/services/ServiceCompanyService';
import { FileService } from '../../src/shared/services/file.service';
import { getRepository, Repository } from 'typeorm';
import { HomeProvider } from '../../src/home/providers/home-provider';
import * as fakerStatic from 'faker';
import { CreateServiceDto } from '../../src/home/dto/create-service.dto';
import { MusicService } from '../../src/home/services/MusicService';
import { MusicFileService } from '../../src/home/services/MusicFileService';
import { Music } from '../../src/entities/music.entity';
import { BullModule } from '@nestjs/bull';
import { UserInRoles } from '../../src/entities/user-in-roles.entity';

/**
 * Testing Service controller api
 */
describe('Service Controller tests', () => {
  let app: INestApplication;
  let serviceController: ServiceCompanyController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
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
      controllers: [ServiceCompanyController],
      providers: [ServiceCompanyService, FileService,
        MusicService,
        MusicFileService,
        {
          provide: getRepositoryToken(Music),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ServiceCompanyEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OrderEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserInRoles),
          useClass: Repository,
        },
        ...HomeProvider,
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
      .attach('file', 'src/public/services/example.png')
      .field('name', fakerStatic.name.title())
      .expect(200);
  });
  afterAll(async () => {
    await app.close();
  });
});