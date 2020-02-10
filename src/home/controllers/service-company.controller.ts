import { Body, Controller, Get, HttpException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ServiceCompanyEntity } from '../../entities/service.company.entity';
import { ServiceCompanyService } from '../services/ServiceCompanyService';
import { CreateServiceDto } from '../dto/create-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('api/service')
export class ServiceCompanyController {
  constructor(private readonly serviceCompanyService: ServiceCompanyService) {
  }

  @Get('/all')
  public async getAllServices() {
    const allServices = await this.serviceCompanyService.getAllServices();
    return allServices;
  }

  /**
   * Создание сервиса в базе данных
   * @param createServiceDto Параметры создания сервис
   * @param file Файл с параметрами для создания изображения
   */
  @Post('/')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req: Request, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Доступны только изображения'), false);
      }
      callback(null, true);
    },
  }))
  public async createService(@Body() createServiceDto: CreateServiceDto, @UploadedFile() file) {
    if (!file) {
      throw new HttpException('Укажите файл', 409);
    }
    const createdService = await this.serviceCompanyService.createService(createServiceDto, file);
    return createdService;
  }
}