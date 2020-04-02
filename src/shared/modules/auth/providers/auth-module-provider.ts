import { USER_SERVICE_DEPENDENCY } from "../constants/auth-module-constants";
import { UserService } from "../services/user.service";
import { ExistingProvider, Provider } from "@nestjs/common";

export const AuthModuleProvider: Provider[] = [
    {
        provide: USER_SERVICE_DEPENDENCY,
        useClass: UserService
    }
]