import {
  Body,
  Controller, Get,
  HttpStatus, Param,
  Post,
  Req,
  Res,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { BodyInfoDto } from '../dto/order-info.dto';
import { Request, Response } from 'express';
import { LocalGuard } from '../../guards/local.guard';
import { User } from '../../entities/user.entity';
import { ORDER_SERVICE } from '../constans/home-constants';
import { IOrderService } from '../interfaces/i-order-service';

/**
 * Controller for serving request of order
 * @copyright Serdar Durdyev
 */
@Controller('/api/order')
export class OrderController {
  constructor(@Inject(ORDER_SERVICE) private readonly orderService: IOrderService) {
  }

  /**
   * Post request for ordering service of company
   * @param orderInfo Order info about serving requests
   * @param response Response of result operations
   * @param request Request info
   */
  @Post('/')
  @UseGuards(LocalGuard)
  public async serveOrder(@Body() orderInfo: BodyInfoDto, @Res() response: Response,
    @Req() request: Request) {
    const savedOrder = await this.orderService.registerOrder(orderInfo, (request.user as User).id);
    if (savedOrder) response.status(HttpStatus.OK).json({
      message: 'Шаблон обработан',
      id: savedOrder.id,
    });
    else response.status(HttpStatus.BAD_REQUEST).json({
      message: 'Что-то пошло не так! Обратитесь к админстратору',
    });
  }

  /**
   * Get common information about order
   * The result will not include specific user information
   * in particular order
   *
   * @param id Id of order
   */
  @Get('common/:id/')
  public async getCommonInfoOrderById(@Param('id') id: string) {
    return await this.orderService.getOrderById(id);
  }

  /**
   * Get detailed info about order by id
   * @param id Id of requested order
   */
  @Get('detail/:id')
  public async getDetailedInfoById(@Param('id') id: string) {
    return await this.orderService.getOrderDetailedInfo(id);
  }
}
