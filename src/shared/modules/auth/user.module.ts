import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../entities/user.entity';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { RoleService } from './services/role.service';
import { UserInRoles } from '../../../entities/user-in-roles.entity';
import { Role } from '../../../entities/role.entity';

@Global()
@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_KEY,
    signOptions: { expiresIn: '2h', issuer: 'dmasters' },
  }),
    TypeOrmModule.forFeature([User, UserInRoles, Role]),
  ],
  providers: [AuthService, UserService, RoleService],
  controllers: [UserController],
})
export class UserModule {
}