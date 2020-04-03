import { BadRequestException, Injectable } from '@nestjs/common';
import { BodyInfoDto } from '../dto/order-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceCompanyEntity } from '../../entities/service.company.entity';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { User } from '../../entities/user.entity';
import { IOrderService } from '../interfaces/i-order-service';

/**
 * Service which contains business logic of ordering
 * services in company
 *
 * @copyright Serdar Durdyev
 */
@Injectable()
export class OrderService implements IOrderService {
  constructor(@InjectRepository(ServiceCompanyEntity) private readonly serviceCompanyRepository: Repository<ServiceCompanyEntity>,
              @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>,
              @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
  }

  /**
   * Register order in database
   * @param orderInfo Contains array of data about service order
   * @param currentUserId Current user id which performs request
   * @throws {BadRequestException} Exception if order is incorrect
   */
  public async registerOrder(orderInfo: BodyInfoDto, currentUserId: string): Promise<OrderEntity> {
    const validatedServiceInfo: [boolean, Array<ServiceCompanyEntity>] = await this.validateServices(orderInfo);
    if (!validatedServiceInfo[0]) throw new BadRequestException('Данные заказы не верны. Возможно указанная услуга отсутсвует в базе');
    const selectedServices: Array<ServiceCompanyEntity> = validatedServiceInfo[1];
    const createdOrder = await this.createOrder(orderInfo, selectedServices, currentUserId);
    return createdOrder;
  }

  /**
   * Partial function for saving data about order
   * @param orderInfo Data from post body request
   * @param selectedServices Services which has been passed validation
   * @param currentUserId Current user which performs the operation
   */
  private async createOrder(orderInfo: BodyInfoDto, selectedServices: Array<ServiceCompanyEntity>, currentUserId: string): Promise<OrderEntity> {
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
    return newOrder;
  }

  /**
   * Validate posted service info
   * @param orderInfoDto Info
   */
  private async validateServices(orderInfoDto: BodyInfoDto): Promise<[boolean, Array<ServiceCompanyEntity>]> {
    const selectedServices: Array<ServiceCompanyEntity> = [];
    for (const service of orderInfoDto.info) {
      const existedService = await this.serviceCompanyRepository.findOne(service.idService);
      if (!existedService) {
        break;
        return [false, null];
      } else selectedServices.push(existedService);
    }
    return [true, selectedServices];
  }

  /**
   * Get order info by id
   * @param id Id of selected Order
   */
  public async getOrderById(id: string): Promise<OrderEntity> {
    return await this.orderRepository.findOne(id);
  }

  /**
   * Get detailed info about order
   * including user info (email & id)
   * @param id Id of requested order in our system
   */
  public async getOrderDetailedInfo(id: string): Promise<any> {
    const order = await this.getOrderById(id);

    if (!order) return null;
    const result: any = {
      ...order,
    };

    const user = await this.userRepository.findOne(order.user_id);
    delete result.user_id;
    if (user) {
      result.user = {
        id: user.id,
        email: user.email,
      };
    } else result.user = null;
    return result;
  }
}
