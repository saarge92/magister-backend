import { Body, Controller, HttpStatus, Post, Res, Inject } from '@nestjs/common';
import { UserDto } from '../../../dto/user.dto';
import { Response } from 'express';
import { UserInfoDto } from '../../../dto/user-info.dto';
import { GrantedUserGateWay } from '../../../../granted-user.gateway';
import { AUTH_SERVICE_DEPENDENCY } from '../constants/auth-module-constants';
import { IAuthService } from '../interfaces/i-auth-service';

/**
 * Controller for working with users
 * include registration & login logic of users
 * @copyright Serdar Durdyev
 */
@Controller('/api/user')
export class UserController {

  constructor(@Inject(AUTH_SERVICE_DEPENDENCY) private readonly authService: IAuthService,
    private readonly websocketServer: GrantedUserGateWay) {
  }

  /**
   * Register user in database
   * @param userDto Object with parameters of created user
   * @param response Response to frontend what happened
   */
  @Post('/register')
  public async registerUser(@Body() userDto: UserDto, @Res() response: Response) {
    const userInfo: UserInfoDto = await this.authService.registerUser(userDto);
    await this.websocketServer.webServer.emit('user.registered', { email: userInfo.user.email });
    return response.status(HttpStatus.OK).json({
      token: userInfo.token,
    });
  }

  /**
   * Login user in database
   * @param userDto Object with email & password for login
   * @param response Response to frontend what happened
   */
  @Post('/login')
  public async loginUser(@Body() userDto: UserDto, @Res() response: Response) {
    const token = await this.authService.loginUser(userDto);
    return response.status(HttpStatus.OK).json({ token });
  }

}