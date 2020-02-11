import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ServiceCompanyEntity } from '../../entities/service.company.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateServiceDto } from '../dto/create-service.dto';
import * as fileSystem from 'fs';
import { FileService } from '../../shared/services/file.service';

/**
 * Service for working with entity "Service of company"
 * @author Serdar Durdyev
 */
@Injectable()
export class ServiceCompanyService {
  constructor(@InjectRepository(ServiceCompanyEntity) private readonly serviceCompanyRepository: Repository<ServiceCompanyEntity>,
              private readonly  fileService: FileService) {
  }

  /**
   * Get all service of company
   * @return {Promise<ServiceCompanyEntity[]>} Список услуг компании
   */
  public async getAllServices(): Promise<ServiceCompanyEntity[]> {
    return await this.serviceCompanyRepository.find();
  }

  /**
   * Creating service in database
   * @param createServiceDto Request body with parameters of service company
   * @return {Promise<ServiceCompanyEntity>} Async result with created service of company
   */
  public async createService(createServiceDto: Partial<CreateServiceDto>, file: any): Promise<ServiceCompanyEntity> {
    const newService = this.serviceCompanyRepository.create();
    newService.name = createServiceDto.name;
    const relatedPath = this.generateServiceImageFileName(file.originalname);
    await this.fileService.saveFile(relatedPath, file);
    newService.image_path = relatedPath;
    await this.serviceCompanyRepository.save(newService);
    return newService;
  }

  /**
   * Update service of company
   * @param id Id of changing service
   * @param updateServiceDto Parameters of updating service of company
   * @param file New image file for service of company
   */
  public async updateService(id: string, updateServiceDto: Partial<CreateServiceDto>, file: any): Promise<ServiceCompanyEntity> {
    const updateService = await this.serviceCompanyRepository.findOne(id);
    if (!updateService) {
      throw new HttpException('Обновляемая услуга не найдена', HttpStatus.CONFLICT);
    }
    updateService.name = updateServiceDto.name;
    if (file) {
      const relatedPath = this.generateServiceImageFileName(file.originalname);
      await this.fileService.saveFile(relatedPath, file);
      updateService.image_path = relatedPath;
    }
    await this.serviceCompanyRepository.save(updateService);
    return updateService;
  }

  /**
   * Generate new name of service file
   * @param fileName Name of new image file
   */
  private generateServiceImageFileName(fileName: string): string {
    const splittedNames: string[] = fileName.split('.');
    const randomNameFile = splittedNames[0] + '_' + Date.now();
    const relatedPath = 'public/services/' + randomNameFile + '.' + splittedNames[1];
    return relatedPath;
  }

  /**
   * Delete Service of company
   * @param id id of deleted company
   */
  public async deleteService(id: string) {
    const deletedService = await this.serviceCompanyRepository.findOne(id);
    if (!deletedService) throw new HttpException('Данный сервис отсутствует в базе', HttpStatus.CONFLICT);
    await this.fileService.deleteFile(deletedService.image_path);
    await this.serviceCompanyRepository.delete(id);
  }

}
