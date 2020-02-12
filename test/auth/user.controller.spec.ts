import { UserController } from '../../src/shared/modules/auth/controllers/user.controller';
import { AuthService } from '../../src/shared/modules/auth/services/auth.service';
import { Test } from '@nestjs/testing';
import { UserDto } from '../../src/shared/dto/user.dto';

describe('UserController test', () => {
  let userController: UserController;
  let authService: AuthService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [AuthService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userController = moduleRef.get<UserController>(UserController);
  });
});