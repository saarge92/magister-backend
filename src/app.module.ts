import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeModule } from './home/home.module';
import { UserModule } from './shared/modules/auth/user.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [TypeOrmModule.forRoot(), HomeModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {
}
