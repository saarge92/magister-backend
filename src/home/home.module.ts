import { Module } from '@nestjs/common';
import { ServiceCompanyController } from './controllers/service-company.controller';
import { ServiceCompanyService } from './services/ServiceCompanyService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCompanyEntity } from '../entities/service.company.entity';
import { FileService } from '../shared/services/file.service';
import { UserModule } from '../shared/modules/auth/user.module';
import { MusicControllerController } from './controllers/music.controller.controller';
import { MusicService } from './services/MusicService';
import { Music } from '../entities/music.entity';
import { BullModule } from '@nestjs/bull';
import { AudioConsumer } from './proccessors/AudoProccessor';
import { MusicFileService } from './services/MusicFileService';
import { OrderController } from './controllers/order.controller';
import { OrderEntity } from '../entities/order.entity';
import { OrderService } from './services/OrderService';
import { User } from '../entities/user.entity';
import { HomeProvider } from './providers/home-provider';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCompanyEntity, Music, OrderEntity, User]), UserModule,
  BullModule.registerQueueAsync(
    {
      name: 'audio',
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
    },
  ),
  ],
  controllers: [ServiceCompanyController, MusicControllerController, OrderController],
  providers: [FileService, MusicService, AudioConsumer, MusicFileService, ...HomeProvider],
})
export class HomeModule {
}