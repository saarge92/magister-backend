import { UserService } from '../../../src/shared/modules/auth/services/user.service';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
import { User } from '../../../src/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { connectionName, getConnectionParameters } from '../../connections/connection';
import { UserDto } from '../../../src/shared/dto/user.dto';
import * as fakerStatic from 'faker';
import { IUserService } from '../../../src/shared/modules/auth/interfaces/i-user-service';

/**
 * Test User Service
 * @copyright Serdar Durdyev
 */
describe('User Service test', () => {
  let userService: IUserService;
  let userRepositoryMock: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();
    const connection = await createConnection(getConnectionParameters([User]));
    userRepositoryMock = getRepository(User, connection.name);
    userService = new UserService(userRepositoryMock);
  });

  it('Create user should return created user', async () => {
    expect(userRepositoryMock).toBeDefined();
    expect(userService).toBeDefined();
    const userDto: UserDto = new UserDto();
    userDto.email = fakerStatic.internet.email();
    userDto.password = fakerStatic.internet.password();
    const createdUser = await userService.createUser(userDto);
    expect(createdUser).toHaveProperty('email');
    expect(createdUser instanceof User).toBe(true);
  });

  it('Get user by email should return user', async () => {
    const randomUser = await userRepositoryMock.createQueryBuilder()
      .orderBy('RAND()').getOne();
    const expectedUser = await userService.getUserByEmail(randomUser.email);
    expect(expectedUser).toBeDefined();
    expect(expectedUser.email).toBe(randomUser.email);
  });

  afterEach(async () => {
    await getConnection(connectionName).close();
  });
});