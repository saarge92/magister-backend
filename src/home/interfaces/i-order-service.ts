import { BodyInfoDto } from '../dto/order-info.dto';
import { OrderEntity } from '../../entities/order.entity';

/**
 * Interface-contract for Order Service
 * @copyright Serdar Durdyev
 */
export interface IOrderService {
  registerOrder(orderInfo: BodyInfoDto, currentUserId: string): Promise<OrderEntity>;

  getOrderById(id: string): Promise<OrderEntity>;

  getOrderDetailedInfo(id: string): Promise<any>;
}