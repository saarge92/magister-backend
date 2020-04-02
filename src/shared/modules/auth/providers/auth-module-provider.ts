import { USER_SERVICE_DEPENDENCY, ROLE_SERVICE_DEPENDENCY, AUTH_SERVICE_DEPENDENCY } from "../constants/auth-module-constants";
import { UserService } from "../services/user.service";
import { Provider } from "@nestjs/common";
import { RoleService } from "../services/role.service";
import { AuthService } from "../services/auth.service";

export const AuthModuleProvider: Provider[] = [
    {
        provide: USER_SERVICE_DEPENDENCY,
        useClass: UserService
    },
    {
        provide: ROLE_SERVICE_DEPENDENCY,
        useClass: RoleService
    },
    {
        provide: AUTH_SERVICE_DEPENDENCY,
        useClass: AuthService
    }
]