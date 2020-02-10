import { Module } from '@nestjs/common';
import { ServiceCompanyController } from './controllers/service-company.controller';
import { ServiceCompanyService } from './services/ServiceCompanyService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCompanyEntity } from '../entities/service.company.entity';
import { FileService } from '../shared/services/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCompanyEntity])],
  controllers: [ServiceCompanyController],
  providers: [ServiceCompanyService, FileService],
})
export class HomeModule {
}