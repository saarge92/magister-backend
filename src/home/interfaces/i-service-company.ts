/**
 * Interface-contract for ServiceCompany service
 * which contains business logic about services of company
 * @copyright Serdar Durdyev
 */
import { ServiceCompanyEntity } from '../../entities/service.company.entity';
import { CreateServiceDto } from '../dto/create-service.dto';


export interface IServiceCompanyService {
  getAllServices(): Promise<ServiceCompanyEntity[]>

  createService(createServiceDto: Partial<CreateServiceDto>, file: any): Promise<ServiceCompanyEntity>;

  updateService(id: string, updateServiceDto: Partial<CreateServiceDto>, file: any): Promise<ServiceCompanyEntity>

  deleteService(id: string);
}