import { WebSocketServer, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { JwtUtility } from './shared/modules/auth/utilities/jwt.utility';
import { IRoleService } from './shared/modules/auth/interfaces/i-role-service';
import { ROLE_SERVICE_DEPENDENCY } from './shared/modules/auth/constants/auth-module-constants';
import { Inject } from '@nestjs/common';

/**
 * Websocket gateway for admin users only
 */
@WebSocketGateway(3001, { namespace: 'admin' })
export class GrantedUserGateWay implements OnGatewayConnection {
  constructor(private readonly jwtUtility: JwtUtility,
    @Inject(ROLE_SERVICE_DEPENDENCY) private readonly userInRoleService: IRoleService) {
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
