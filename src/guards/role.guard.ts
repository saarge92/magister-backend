import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtUtility } from '../shared/modules/auth/utilities/jwt.utility';
import { RoleService } from '../shared/modules/auth/services/role.service';
import { User } from '../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector,
              private readonly jwtUtility: JwtUtility,
              private readonly roleService: RoleService,
  ) {
  }

  /**
   * Logic of
   * @param context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: string[] = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) return false;
    const user = await this.jwtUtility.getUserFromToken(request.headers.authorization);
    if (!user) {
      return false;
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