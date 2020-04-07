/**
 * Interface-contract for auth service implementation
 * @copyright Serdar Durdyev
 */
import { UserDto } from '../../../dto/user.dto';
import { UserInfoDto } from '../../../dto/user-info.dto';
import { User } from '../../../../entities/user.entity';

export interface IAuthService {
  registerUser(userDto: UserDto): Promise<UserInfoDto>;

  loginUser(userDto: UserDto): Promise<string>;

  signUser(user: User): string;
}