import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../../../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../../../../entities/user.entity';
import { UserInfoDto } from '../../../dto/user-info.dto';
import { USER_SERVICE_DEPENDENCY, ROLE_SERVICE_DEPENDENCY } from '../constants/auth-module-constants';
import { IUserService } from '../interfaces/i-user-service';
import { IRoleService } from '../interfaces/i-role-service';

/**
 * Service for authenticating user in system
 * @copyright Serdar Durdyev
 */
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
    @Inject(USER_SERVICE_DEPENDENCY) private readonly userService: IUserService,
    @Inject(ROLE_SERVICE_DEPENDENCY) private readonly roleService: IRoleService,
  ) {
  }

  /**
   * Register User in database
   * @param userDto Object with parameters about users
   */
  public async registerUser(userDto: UserDto): Promise<UserInfoDto> {
    const existedUser = await this.userService.getUserByEmail(userDto.email);
    if (existedUser) throw new HttpException('Пользователь уже зарегистрирован', HttpStatus.CONFLICT);
    const createdUser = await this.userService.createUser(userDto);
    await this.roleService.addUserToRole('User', createdUser);
    const token = this.signUser(createdUser);
    return {
      token,
      user: createdUser,
    };
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
