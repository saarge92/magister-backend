import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserDto } from '../../../dto/user.dto';
import { AuthService } from '../services/jwt.service';
import { Response } from 'express';

@Controller('/api/user')
export class UserController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('/register')
  public async registerUser(@Body() userDto: UserDto, @Res() response: Response) {
    const token = await this.authService.registerUser(userDto);
    return response.status(HttpStatus.OK).json({
      token,
    });
  }

  @Post('/login')
  public async loginUser(@Body() userDto: UserDto, @Res() response: Response) {
    const token = await this.authService.checkUser(userDto);
    return response.status(HttpStatus.OK).json({ token });
  }

}