import { BadRequestException, Injectable } from '@nestjs/common';
import { BodyInfoDto } from '../dto/order-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceCompanyEntity } from '../../entities/service.company.entity';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../entities/order.entity';

/**
 * Service which contains business logic of ordering
 * services in company
 *
 * @copyright Serdar Durdyev
 */
@Injectable()
export class OrderService {
  constructor(@InjectRepository(ServiceCompanyEntity) private readonly serviceCompanyRepository: Repository<ServiceCompanyEntity>,
              @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>) {
  }

  /**
   * Register order in database
   * @param orderInfo Contains array of data about service order
   * @param currentUserId Current user id which performs request
   * @throws {BadRequestException} Exception if order is incorrect
   */
  public async registerOrder(orderInfo: BodyInfoDto, currentUserId: string): Promise<boolean> {
    const validatedServiceInfo: [boolean, Array<ServiceCompanyEntity>] = await this.validateServices(orderInfo);
    if (!validatedServiceInfo[0]) throw new BadRequestException('Данные заказы не верны. Возможно указанная услуга отсутсвует в базе');
    const selectedServices: Array<ServiceCompanyEntity> = validatedServiceInfo[1];

    let index = 0;
    let totalQty: number = 0;
    let totalSum: number = 0;
    const infoOrder: Array<any> = [];
    for (const order of orderInfo.info) {
      const item = {
        id: order.idService,
        quantity: order.quantity,
        sum: order.quantity * selectedServices[index].price,
      };
      infoOrder.push(item);
      totalQty += order.quantity;
      totalSum += item.sum;
      index++;
    }
    const newOrder = this.orderRepository.create();
    newOrder.user_id = currentUserId;
    newOrder.info_order = JSON.stringify(infoOrder);
    newOrder.total_qty = totalQty;
    newOrder.total_price = totalSum;
    await this.orderRepository.save(newOrder);
    return true;
  }

  /**
   * Validate posted service info
   * @param orderInfoDto Info
   */
  private async validateServices(
    orderInfoDto: BodyInfoDto,
  ): Promise<[boolean, Array<ServiceCompanyEntity>]> {
    const selectedServices: Array<ServiceCompanyEntity> = [];
    for (const service of orderInfoDto.info) {
      const existedService = await this.serviceCompanyRepository.findOne(
        service.idService,
      );
      if (!existedService) {
        break;
        return [false, null];
      } else selectedServices.push(existedService);
    }
    return [true, selectedServices];
  }
}
