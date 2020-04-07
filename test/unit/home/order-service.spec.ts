import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { connectionName, connectionParameters } from '../../connections/connection';
import { OrderService } from '../../../src/home/services/OrderService';
import { HomeModule } from '../../../src/home/home.module';
import { getConnection, getRepository, Repository } from 'typeorm';
import { OrderEntity } from '../../../src/entities/order.entity';
import { User } from '../../../src/entities/user.entity';
import { ServiceCompanyEntity } from '../../../src/entities/service.company.entity';

/**
 * Testing order service functionality
 * Order service class
 * @copyright Serdar Durdyev
 */
describe('Order service test', () => {
  let orderService: OrderService;
  let orderRepository: Repository<OrderEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...connectionParameters,
          entities: [OrderEntity, User, ServiceCompanyEntity],
        }),
      ],
      providers: [OrderService, {
        provide: getRepositoryToken(OrderEntity),
        useClass: Repository,
      },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ServiceCompanyEntity),
          useClass: Repository,
        },
      ],
    }).compile();
    orderRepository = getRepository(OrderEntity);
    orderService = new OrderService(getRepository(ServiceCompanyEntity), getRepository(OrderEntity), getRepository((User)));
  });

  it('Order service should be defined', () => {
    expect(orderService).toBeDefined();
    expect(orderRepository).toBeDefined();
  });

  it('Get order by id should return common information', async () => {
    const randomEntity = await orderRepository.createQueryBuilder()
      .orderBy('RAND()').getOne();
    const result: any = await orderService.getOrderById(randomEntity.id);
    expect(randomEntity).toBeDefined();
    expect(randomEntity.id).toBe(result.id);
  });

  afterAll(async () => {
    getConnection(connectionName).close();
  });
});