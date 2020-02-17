import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserDto } from '../../../dto/user.dto';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { UserInfoDto } from '../../../dto/user-info.dto';
import { AppGateway } from '../../../../app.gateway';

@Controller('/api/user')
export class UserController {
  constructor(private readonly authService: AuthService, private readonly websocketServer: AppGateway) {
  }

  /**
   * Register user in database
   * @param userDto Object with parameters of created user
   * @param response Response to frontend what happened
   */
  @Post('/register')
  public async registerUser(@Body() userDto: UserDto, @Res() response: Response) {
    const userInfo: UserInfoDto = await this.authService.registerUser(userDto);
    this.websocketServer.webServer.emit('user.registered', { email: userInfo.user.email });
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