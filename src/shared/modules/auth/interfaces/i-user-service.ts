import { UserDto } from "src/shared/dto/user.dto";
import { User } from "src/entities/user.entity";

/**
 * Interface-contract for user-service implementation
 * @copyright Serdar Durdyev
 */
export interface IUserService {
    createUser(userDto: UserDto): Promise<User>
    getUserByEmail(email: string): Promise<User>;
}