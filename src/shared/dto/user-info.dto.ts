import { User } from '../../entities/user.entity';

export interface UserInfoDto {
  token: string;
  user: User;
}