import {
  Body,
  Controller, Delete,
  Get,
  HttpException, HttpStatus,
  Param,
  Patch,
  Post, Res,
  UploadedFile, UseGuards,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { ServiceCompanyEntity } from '../../entities/service.company.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SERVICE_COMPANY_SERVICE } from '../constans/home-constants';
import { IServiceCompanyService } from '../interfaces/i-service-company';

@Controller('api/service')
export class ServiceCompanyController {
  constructor(@Inject(SERVICE_COMPANY_SERVICE) private readonly serviceCompanyService: IServiceCompanyService) {
  }

  @Get('/all')
  public async getAllServices() {
    const allServices = await this.serviceCompanyService.getAllServices();
    return allServices;
  }

  /**
   * Creating service in database
   * @param createServiceDto Service parameters for creation
   * @param file Файл с параметрами для создания изображения
   */
  @Post('/')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req: any, file: any, callback: Function) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return callback(new HttpException('Разрешены только изображение', HttpStatus.BAD_REQUEST), false);
      }
      return callback(null, true);
    },
  }))
  public async createService(@UploadedFile() file, @Body() createServiceDto: CreateServiceDto) {
    if (!file) {
      throw new HttpException('Укажите файл', 409);
    }
    const createdService = await this.serviceCompanyService.createService(createServiceDto, file);
    return createdService;
  }

  /**
   * Patch service by id
   * @param id Id of edited service of company
   * @param updateServiceDto Data transfer object about changing service
   * @param file Sended image for service
   */
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req: any, file: any, callback: Function) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return callback(new HttpException('Разрешены только изображение', HttpStatus.BAD_REQUEST), false);
      }
      return callback(null, true);
    },
  }))
  public async updateService(@Param('id') id: string, @Body() updateServiceDto: CreateServiceDto, @UploadedFile() file): Promise<ServiceCompanyEntity> {
    return await this.serviceCompanyService.updateService(id, updateServiceDto, file);
  }

  /**
   * Delete service for file
   * @param id Id of deleting service
   * @param response Response when service is deleted
   */
  @Delete('/:id')
  public async deleteService(@Param('id') id: string, @Res() response: Response) {
    await this.serviceCompanyService.deleteService(id);
    response.status(HttpStatus.OK).json({ message: 'Успешно удаленно' });
  }

}