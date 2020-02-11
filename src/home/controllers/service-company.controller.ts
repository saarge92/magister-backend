import {
  Body,
  Controller, Delete,
  Get,
  HttpException, HttpStatus,
  Param,
  Patch,
  Post, Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ServiceCompanyEntity } from '../../entities/service.company.entity';
import { ServiceCompanyService } from '../services/ServiceCompanyService';
import { CreateServiceDto } from '../dto/create-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

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
    fileFilter: this.fileFilter,
  }))
  public async createService(@Body() createServiceDto: CreateServiceDto, @UploadedFile() file) {
    if (!file) {
      throw new HttpException('Укажите файл', 409);
    }
    const createdService = await this.serviceCompanyService.createService(createServiceDto, file);
    return createdService;
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: this.fileFilter,
  }))
  public async updateService(@Param('id')id: string, @Body() updateServiceDto: CreateServiceDto, @UploadedFile()file): Promise<ServiceCompanyEntity> {
    return await this.serviceCompanyService.updateService(id, updateServiceDto, file);
  }

  /**
   * Validation file function
   * @param req
   * @param file
   * @param callback
   */
  private fileFilter(req: Request, file, callback: Function) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Доступны только изображения'), false);
    }
    callback(null, true);
  }

  @Delete('/:id')
  public async deleteService(@Param('id')id: string, @Res() response: Response) {
    await this.serviceCompanyService.deleteService(id);
    response.status(HttpStatus.OK).json({ message: 'Успешно удаленно' });
  }
}