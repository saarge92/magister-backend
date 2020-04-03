import { Provider } from "@nestjs/common";
import { ORDER_SERVICE, SERVICE_COMPANY_SERVICE } from "../constans/home-constants";
import { OrderService } from "../services/OrderService";
import { ServiceCompanyService } from "../services/ServiceCompanyService";

export const HomeProvider: Provider[] = [
    {
        provide: ORDER_SERVICE,
        useClass: OrderService
    },
    {
        provide: SERVICE_COMPANY_SERVICE,
        useClass: ServiceCompanyService
    }
]