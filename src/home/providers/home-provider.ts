import { Provider } from "@nestjs/common";
import { ORDER_SERVICE, SERVICE_COMPANY_SERVICE, MUSIC_SERVICE } from "../constans/home-constants";
import { OrderService } from "../services/OrderService";
import { ServiceCompanyService } from "../services/ServiceCompanyService";
import { MusicService } from "../services/MusicService";

export const HomeProvider: Provider[] = [
    {
        provide: ORDER_SERVICE,
        useClass: OrderService
    },
    {
        provide: SERVICE_COMPANY_SERVICE,
        useClass: ServiceCompanyService
    },
    {
        provide: MUSIC_SERVICE,
        useClass: MusicService
    }
]