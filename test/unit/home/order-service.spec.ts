import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../../../src/shared/modules/auth/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionParameters } from '../../connections/connection';
import { OrderService } from '../../../src/home/services/OrderService';
import { HomeModule } from '../../../src/home/home.module';
import { getRepository, Repository } from 'typeorm';
import { OrderEntity } from '../../../src/entities/order.entity';

/**
 * Testing order service functionality
 * Order service class
 * @copyright Serdar Durdyev
 */
describe('Order service test', () => {
  let orderService: OrderService;
  let orderRepository: Repository<OrderEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HomeModule,
        TypeOrmModule.forRoot({
          ...connectionParameters,
          entities: ['./**/*.entity.ts'],
        }),
      ],
    }).compile();
    orderService = module.get<OrderService>(OrderService);
    orderRepository = getRepository(OrderEntity);
  });

  it('Order service should be defined', () => {
    expect(orderService).toBeDefined();
  });

  it('Get order by id should return common information', async () => {
    const randomEntity = await orderRepository.createQueryBuilder()
      .orderBy('RAND()').getOne();
    const result: any = await orderService.getOrderById(randomEntity.id);
    expect(randomEntity).toBeDefined();
    expect(randomEntity.id).toBe(result.id);
  });
});