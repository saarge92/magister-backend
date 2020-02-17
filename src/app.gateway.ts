import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './guards/roles.decorator';

@WebSocketGateway(81)
export class AppGateway {
  @WebSocketServer() webServer;
}
