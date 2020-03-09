import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtUtility } from '../shared/modules/auth/utilities/jwt.utility';
import { Request } from 'express';

/**
 * Common jwt authentication guard for every routes which
 * need user being authenticated
 * @copyright Serdar Durdyev
 */
@Injectable()
export class LocalGuard implements CanActivate {
  constructor(private readonly jwtUtility: JwtUtility) {
  }

  /**
   * Login of authentication using jwt token
   * @param context Context of web application
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization;
    const user = await this.jwtUtility.getUserFromTokenHeader(header);
    if (!user) return false;
    request.user = user;
    return true;
  }
}