import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtUtility } from '../shared/modules/auth/utilities/jwt.utility';
import { RoleService } from '../shared/modules/auth/services/role.service';
import { User } from '../entities/user.entity';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class RolesWebSocketGuard implements CanActivate {
  constructor(private readonly reflector: Reflector,
              private readonly jwtUtility: JwtUtility,
              private readonly roleService: RoleService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: string[] = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return false;
    }
    const request = context.switchToWs().getClient();
    if (!request.headers.authorization) throw new WsException('Укуренные дети 90х');
    ;
    const user = await this.jwtUtility.getUserFromTokenHeader(request.headers.authorization);
    if (!user) {
      throw new WsException('Укуренные дети 90х');
    }
    return await this.validateRoles(roles, user);
  }

  /**
   * Check priviliges of user who perform request
   * @param roles list of roles
   * @param user User recieved from request header
   */
  private async validateRoles(roles: string[], user: User): Promise<boolean> {
    let isUserInRole = false;
    for (const role of roles) {
      const checkRole = await this.roleService.isUserInRole(role, user);
      if (checkRole) {
        isUserInRole = checkRole;
        break;
      }
    }
    return isUserInRole;
  }
}