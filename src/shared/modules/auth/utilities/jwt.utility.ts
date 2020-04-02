import { HttpException, HttpStatus, Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { User } from '../../../../entities/user.entity';
import { USER_SERVICE_DEPENDENCY } from '../constants/auth-module-constants';
import { IUserService } from '../interfaces/i-user-service';

@Injectable()
export class JwtUtility {
  constructor(private readonly jwtService: JwtService,
    @Inject(USER_SERVICE_DEPENDENCY) private readonly userService: IUserService) {
  }

  /**
   * Get token string from Bearer token info
   * @param header Header info with bearer token
   */
  public getTokenFromHeaderString(header: string) {
    if (header === undefined) throw new UnauthorizedException('Токен не указан');
    const splittedToken: Array<string> = header.split(' ');
    if (splittedToken.length < 2) throw new HttpException('Не правильно указан токен', HttpStatus.FORBIDDEN);
    if (splittedToken[0] !== 'Bearer') throw new HttpException('Не правильно указан токен', HttpStatus.FORBIDDEN);
    return splittedToken[1];
  }

  /**
   * Get user from token bearer info
   * @param tokenFromHeader Bearer token from header
   */
  public async getUserFromTokenHeader(tokenFromHeader: string): Promise<User> {
    const token = this.getTokenFromHeaderString(tokenFromHeader);
    return await this.getUserFromToken(token);
  }

  /**
   * Get user from token
   * @param token token string
   * @return {Promise<User>} async object with user
   */
  public async getUserFromToken(token: string): Promise<User> {
    try {
      const decodedData = await this.jwtService.verifyAsync(token);
      return await this.userService.getUserByEmail(decodedData.email);
    } catch (error) {
      const message = 'Ошибка токена ' + error.message || error.name;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}