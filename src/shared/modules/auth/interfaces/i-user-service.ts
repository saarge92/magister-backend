/**
 * Interface-contract for user-service implementation
 * @copyright Serdar Durdyev
 */
import { UserDto } from '../../../dto/user.dto';
import { User } from '../../../../entities/user.entity';

export interface IUserService {
  createUser(userDto: UserDto): Promise<User>

  getUserByEmail(email: string): Promise<User>;
}