import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeModule } from './home/home.module';

@Module({
  imports: [TypeOrmModule.forRoot(), HomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
