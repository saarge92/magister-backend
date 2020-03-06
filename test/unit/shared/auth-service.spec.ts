import { AuthService } from '../../../src/shared/modules/auth/services/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../../../src/shared/modules/auth/user.module';
import * as fakerStatic from 'faker';
import { UserDto } from '../../../src/shared/dto/user.dto';
import { connectionParameters } from '../../connections/connection';
import { getRepository, Repository } from 'typeorm';
import { User } from '../../../src/entities/user.entity';


/**
 * Testing AuthService functionality
 */
describe('Auth service test', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule,
        TypeOrmModule.forRoot({
          ...connectionParameters,
          entities: ['./**/*.entity.ts'],
        }),
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    userRepository = getRepository(User);
  });

  /**
   * Test register user in database
   */
  it('Auth service should be defined and create register user', async () => {
    expect(authService).toBeDefined();
    const randomUserDto: UserDto = {
      email: fakerStatic.internet.email(),
      password: fakerStatic.internet.email(),
    };
    const registeredUserInfo = await authService.registerUser(randomUserDto);
    expect(registeredUserInfo).toBeDefined();
    expect(registeredUserInfo).toHaveProperty('token');
  });

  /**
   * Test sign user by user instance
   */
  it('sign user and should return string', async () => {
    expect(userRepository).toBeDefined();
    const random = await userRepository.createQueryBuilder()
      .orderBy('RAND()').getOne();
    const signResult = authService.signUser(random);
    expect(signResult).toBeDefined();
    expect(typeof signResult).toBe('string');
  });
});