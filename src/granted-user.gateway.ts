import { WebSocketServer, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { RolesWebSocketGuard } from './guards/role.guard.websocket';
import { JwtUtility } from './shared/modules/auth/utilities/jwt.utility';
import { RoleService } from './shared/modules/auth/services/role.service';

/**
 * Websocket gateway for admin users only
 */
@WebSocketGateway(3001, { namespace: 'admin' })
export class GrantedUserGateWay implements OnGatewayConnection {
  constructor(private readonly jwtUtility: JwtUtility, private readonly userInRoleService: RoleService) {
  }

  /**
   * Logic of connection for users
   * @param client Socket client for connection
   * @param args
   */
  async handleConnection(client: any, ...args: any[]) {
    const token = client.handshake.query.token;
    if (!token) client.disconnect();
    const user = await this.jwtUtility.getUserFromToken(token);
    if (!user) client.disconnect();
    const userInRole = await this.userInRoleService.isUserInRole('Admin', user);
    if (!userInRole) client.handshake.disconnect();
  }

  @WebSocketServer() webServer;

}
