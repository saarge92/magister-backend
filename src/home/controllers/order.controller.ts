import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BodyInfoDto } from '../dto/order-info.dto';
import { OrderService } from '../services/OrderService';
import { Request, Response } from 'express';
import { LocalGuard } from '../../guards/local.guard';
import { User } from '../../entities/user.entity';

/**
 * Controller for serving request of order
 * @copyright Serdar Durdyev
 */
@Controller('/api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {
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
    const isSaved = await this.orderService.registerOrder(orderInfo, (request.user as User).id);
    if (isSaved) response.status(HttpStatus.OK).json({
      message: 'Шаблон обработан',
    });
    else response.status(HttpStatus.BAD_REQUEST).json({
      message: 'Что-то пошло не так! Обратитесь к админстратору',
    });
  }
}
