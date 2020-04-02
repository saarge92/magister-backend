import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../entities/user.entity';
import { AuthService } from './services/auth.service';
import { UserController } from './controllers/user.controller';
import { RoleService } from './services/role.service';
import { UserInRoles } from '../../../entities/user-in-roles.entity';
import { Role } from '../../../entities/role.entity';
import { JwtUtility } from './utilities/jwt.utility';
import { GrantedUserGateWay } from '../../../granted-user.gateway';
import { LocalGuard } from '../../../guards/local.guard';
import { AuthModuleProvider } from './providers/auth-module-provider';

@Global()
@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_KEY,
    signOptions: { expiresIn: '2h', issuer: 'dmasters' },
  }),
  TypeOrmModule.forFeature([User, UserInRoles, Role]),
  ],
  providers: [...AuthModuleProvider, AuthService, JwtUtility,
    GrantedUserGateWay, LocalGuard,
  ],
  controllers: [UserController],
  exports: [...AuthModuleProvider, AuthService, JwtUtility, JwtModule],
})
export class UserModule {
}