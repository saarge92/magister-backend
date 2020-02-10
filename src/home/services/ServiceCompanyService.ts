import { Injectable } from '@nestjs/common';
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
    const relatedPath = 'public/services/' + file.originalname;
    await this.fileService.saveFile(relatedPath, file);
    newService.image_path = relatedPath;
    await this.serviceCompanyRepository.save(newService);
    return newService;
  }
}
