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

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCompanyEntity, Music]), UserModule,
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
  controllers: [ServiceCompanyController, MusicControllerController],
  providers: [ServiceCompanyService, FileService, MusicService, AudioConsumer],
})
export class HomeModule {
}