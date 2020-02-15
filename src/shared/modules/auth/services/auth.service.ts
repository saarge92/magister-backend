import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../../../dto/user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../../../../entities/user.entity';
import { RoleService } from './role.service';

/**
 * Service for authenticating user in system
 * @copyright Serdar Durdyev
 */
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
              private readonly userService: UserService,
              private readonly roleService: RoleService,
  ) {
  }

  /**
   * Register User in database
   * @param userDto Object with parameters about users
   */
  public async registerUser(userDto: UserDto): Promise<string> {
    const existedUser = await this.userService.getUserByEmail(userDto.email);
    if (existedUser) throw new HttpException('Пользователь уже зарегистрирован', HttpStatus.CONFLICT);
    const createdUser = await this.userService.createUser(userDto);
    await this.roleService.addUserToRole('User', createdUser);
    const token = this.signUser(createdUser);
    return token;
  }

  /**
   * Check user in database & generate token
   * @param userDto Object with parameters about users
   */
  public async loginUser(userDto: UserDto): Promise<string> {
    const existedUser = await this.userService.getUserByEmail(userDto.email);
    if (!existedUser) {
      throw new HttpException('Пользователь или пароль не совпадают', HttpStatus.UNAUTHORIZED);
    }
    const checkHash = await bcrypt.compare(userDto.password, existedUser.password);
    if (checkHash) {
      return this.signUser(existedUser);
    }
    throw new HttpException('Пользователь или пароль не совпадают', HttpStatus.UNAUTHORIZED);
  }

  /**
   * Generate token for user
   * @param user User for subsription
   */
  public signUser(user: User): string {
    return this.jwtService.sign({
      email: user.email,
      sub: user.id,
    });
  }
}
