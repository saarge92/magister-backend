import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { User } from '../../../../entities/user.entity';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtUtility {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {
  }

  public getTokenFromHeaderString(header: string) {
    const splittedToken: string[] = header.split(' ');
    if (splittedToken.length < 2) throw new HttpException('Не правильно указан токен', HttpStatus.FORBIDDEN);
    if (splittedToken[0] !== 'Bearer') throw new HttpException('Не правильно указан токен', HttpStatus.FORBIDDEN);
    return splittedToken[1];
  }

  public async getUserFromToken(tokenFromHeader: string): Promise<User> {
    const token = this.getTokenFromHeaderString(tokenFromHeader);
    try {
      const decodedData = await this.jwtService.verifyAsync(token);
      return await this.userService.getUserByEmail(decodedData.email);
    } catch (error) {
      const message = 'Ошибка токена ' + error.message || error.name;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}