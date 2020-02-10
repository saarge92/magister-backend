import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('public/services/:imageId')
  async getFileStatic(@Res() res, @Param('imageId') imageId): Promise<any> {
    res.sendFile(imageId, { root: 'src/public/services' });
  }
}
