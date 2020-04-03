import { Provider } from "@nestjs/common";
import { ORDER_SERVICE } from "../constans/home-constants";
import { OrderService } from "../services/OrderService";

export const HomeProvider: Provider[] = [
    {
        provide: ORDER_SERVICE,
        useClass: OrderService
    }
]