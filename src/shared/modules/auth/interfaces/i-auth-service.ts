import { UserDto } from "src/shared/dto/user.dto";
import { UserInfoDto } from "src/shared/dto/user-info.dto";
import { User } from "src/entities/user.entity";

/**
 * Interface-contract for auth service implementation
 * @copyright Serdar Durdyev
 */
export interface IAuthService {
    registerUser(userDto: UserDto): Promise<UserInfoDto>;

    loginUser(userDto: UserDto): Promise<string>;

    signUser(user: User): string;
}