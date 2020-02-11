import { Injectable } from '@nestjs/common';
import { User } from '../../../../entities/user.entity';
import { UserDto } from '../../../dto/user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private saltRounds: number = 10;

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
  }

  /**
   * Creating user in database
   * @param userDto params of creating user
   */
  public async createUser(userDto: UserDto): Promise<User> {
    const newUser = new User();
    newUser.email = userDto.email;
    newUser.password = await bcrypt.hash(userDto.password, this.saltRounds);
    await this.userRepository.save(newUser);
    return newUser;
  }

  public async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }
}