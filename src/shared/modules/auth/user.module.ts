import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { register } from 'ts-node';
import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../entities/user.entity';
import { AuthService } from './services/jwt.service';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_KEY,
    signOptions: { expiresIn: '2h', issuer: 'dmasters' },
  }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, UserService],
  controllers: [UserController],
})
export class UserModule {

}