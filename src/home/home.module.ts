import { Module } from '@nestjs/common';
import { ServiceCompanyController } from './controllers/service-company.controller';
import { ServiceCompanyService } from './services/ServiceCompanyService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCompanyEntity } from '../entities/service.company.entity';
import { FileService } from '../shared/services/file.service';
import { UserModule } from '../shared/modules/auth/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCompanyEntity]), UserModule],
  controllers: [ServiceCompanyController],
  providers: [ServiceCompanyService, FileService],
})
export class HomeModule {
}